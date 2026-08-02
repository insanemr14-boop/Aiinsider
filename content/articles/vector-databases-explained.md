---
title: "Vector Databases Explained: Indexes, Filtering and Scale"
description: "How vector databases actually work — similarity metrics, HNSW and IVF index tradeoffs, filtered search, quantization and sharding — plus a survey of the main options."
excerpt: "A vector database is an approximate nearest neighbor index with a storage engine attached. Understanding the index type and the filtering strategy explains almost every performance difference between them."
seoTitle: "Vector Databases Explained: HNSW, IVF, Filtering, Scale"
seoDescription: "Similarity metrics, ANN index tradeoffs, filtered and hybrid search, quantization and sharding — with a decision framework for pgvector, Qdrant, Pinecone and more."
author: engineering-desk
category: vector-databases
tags: ["vector-databases", "embeddings", "hnsw", "pgvector", "rag", "ai-engineering"]
type: analysis
publishDate: 2026-07-03
updatedDate: 2026-08-02
featured: false
editorsPick: false
trending: false
heroAlt: "Abstract visualization of points in a high dimensional space connected by a navigable graph"
faq:
  - question: "What is a vector database?"
    answer: "A vector database stores high-dimensional embedding vectors alongside metadata and supports fast approximate nearest neighbor search over them. The defining component is the index, which trades a small amount of accuracy for search that scales sublinearly with collection size."
  - question: "Do I need a dedicated vector database?"
    answer: "Below roughly ten million vectors with moderate query rates, a vector extension on a database you already operate is usually sufficient and considerably simpler. Dedicated systems earn their place when you need heavy metadata filtering at scale, high sustained query throughput, per-tenant isolation, or aggressive quantization to control memory cost."
  - question: "What is the difference between HNSW and IVF?"
    answer: "HNSW builds a multi-layer navigable graph and gives excellent recall and low query latency at the cost of high memory use and slow index construction. IVF partitions vectors into clusters and searches only the nearest few, which builds faster and uses less memory but generally needs to scan more data for the same recall."
  - question: "Which similarity metric should I use?"
    answer: "Use the metric the embedding model was trained with, which for most modern text embedding models is cosine similarity. When vectors are normalized to unit length, cosine similarity and inner product produce identical rankings, so the choice matters mainly for whether you normalize at ingest."
  - question: "How much memory do vector indexes need?"
    answer: "Raw storage is dimensions multiplied by four bytes per vector for float32, so a million 1536-dimension vectors is roughly six gigabytes before the index. A graph index adds substantial overhead on top of that, which is why scalar and binary quantization are standard practice above a few million vectors."
  - question: "Why does filtering break vector search?"
    answer: "Filtering after retrieval can return far fewer results than requested when the filter is selective, because most of the nearest neighbors get discarded. Systems that handle this well integrate the filter into graph traversal or fall back to exact search when the filtered subset is small enough."
  - question: "Is pgvector fast enough for production?"
    answer: "pgvector handles production workloads well into the millions of vectors, particularly with HNSW indexes and the DiskANN-style extensions built on top of it. Its real advantage is that vectors live in the same transactional database as your relational data, so filters and joins are ordinary SQL rather than a synchronization problem."
  - question: "What is binary quantization?"
    answer: "Binary quantization reduces each vector dimension to a single bit, cutting memory use by a factor of thirty-two against float32 and making distance computation extremely fast. Recall drops meaningfully, so it is used with oversampling — retrieve many candidates from the compressed index, then rescore them against full-precision vectors."
---

A vector database stores embeddings and finds the ones closest to a query vector. Strip away the marketing and every product in the category is the same three components: a distance function, an approximate nearest neighbor index, and a storage layer that also handles metadata filtering.

Understanding those three explains nearly every performance and cost difference between the options, and it explains why the choice matters less than most teams expect.

## Which similarity metric should you use?

The operational rule is short: use the metric the embedding model was trained with, which for most modern text embedding models is cosine similarity. If you normalize vectors to unit length at ingest, cosine and inner product become interchangeable — identical rankings, different numbers. Normalizing is generally worth it because inner product is cheaper to compute.

An embedding model maps text, images or audio to a fixed-length array of floats — commonly a few hundred to a few thousand dimensions. The training objective arranges the space so that semantically related inputs land near each other.

Three distance measures are in general use.

**Cosine similarity** measures the angle between vectors, ignoring magnitude. It is the default for text embeddings because document length should not affect semantic similarity.

**Inner product** (dot product) accounts for both angle and magnitude. Some models are trained for this explicitly. On vectors normalized to unit length, inner product and cosine give identical rankings.

**Euclidean distance** measures straight-line distance. Common for image embeddings and, on normalized vectors, monotonically related to cosine similarity — same ranking, different numbers.

### How much memory do the vectors need?

Dimensionality drives cost. A float32 vector consumes four bytes per dimension, so one million 1536-dimension vectors is about 6 GB of raw data before any index structure — and a graph index adds substantial overhead on top of that. Truncating the vector is the cheapest lever available for cutting both numbers.

Several current embedding models are trained with nested representations that let you truncate the vector — taking the first 512 of 1536 dimensions, for example — with graceful rather than catastrophic quality loss. This is the cheapest lever available for cutting memory and search cost, and it is underused. Test truncation against your retrieval evaluation set before assuming you need the full width.

## Which index type should you choose?

Start with HNSW: it gives the best recall-per-latency of the mainstream options and is the default in most vector databases. Below roughly 100,000 vectors, skip the index and use flat brute-force search. When memory becomes the binding constraint, move to IVF with product quantization, or add scalar or binary quantization on top of HNSW.

Exact nearest neighbor search compares the query against every vector. That is O(N) and, with modern SIMD instructions, genuinely fine up to a few hundred thousand vectors. Beyond that you trade a small amount of recall for a large amount of speed.

### Flat (brute force)

No index. Compare against everything. Perfect recall, linear cost, zero build time, no tuning.

Use it below roughly 100,000 vectors, for any collection that changes constantly, and as the ground truth when measuring another index's recall. Skipping this last use is a common mistake — you cannot know your ANN index's recall without an exact baseline to compare against.

### IVF (inverted file)

Cluster the vectors with k-means into `nlist` cells and record each cell's centroid. At query time, find the nearest `nprobe` centroids and search only vectors in those cells.

Fast to build, modest memory overhead, and recall is tunable at query time by raising `nprobe`. The weaknesses are that it requires a training pass over representative data, that quality degrades as the distribution drifts away from what it was trained on, and that vectors near cell boundaries get missed.

IVF combined with product quantization is the standard configuration for very large collections where memory is the binding constraint.

### HNSW (hierarchical navigable small world)

A multi-layer proximity graph. Upper layers are sparse and connect distant regions; lower layers are dense and local. Search enters at the top, greedily walks toward the query, and descends a layer at a time — coarse navigation followed by fine refinement.

HNSW gives the best recall-per-latency of the mainstream options and is the default in most vector databases. Three parameters govern it:

- **M** — connections per node. Higher improves recall and increases memory.
- **efConstruction** — candidate list size during build. Higher means better graph quality and slower builds.
- **efSearch** — candidate list size at query time. The main runtime recall/latency dial.

The costs are real. Memory overhead is significant on top of the vectors themselves, index construction is slow for large collections, and deletions are soft — nodes are marked rather than removed, so heavy churn degrades the graph until it is rebuilt.

### How much does quantization save?

Compression applied to the vectors themselves, usually combined with an index. Scalar quantization cuts memory by four with small recall loss. Product quantization compresses by an order of magnitude or more with real recall loss. Binary quantization is thirty-two times smaller and recall drops substantially, so it is paired with oversampling and rescoring.

**Scalar quantization** maps each float32 dimension to an int8, cutting memory by four with small recall loss. Close to a free win and a sensible default above a few million vectors.

**Product quantization** splits the vector into subvectors and replaces each with a codebook index. Compression of an order of magnitude or more, with real recall loss, so it is nearly always paired with a rescoring pass over full-precision vectors.

**Binary quantization** reduces each dimension to one bit — thirty-two times smaller, and distance becomes a Hamming computation the CPU does extremely quickly. Recall drops substantially, so it is used with oversampling: retrieve several hundred candidates from the binary index, then rescore against full vectors. On high-dimensional embeddings the combination often preserves most of the original recall at a fraction of the memory.

### Disk-based indexes

DiskANN-style graph indexes keep the graph on SSD with a compressed representation in memory, enabling billion-scale collections on hardware that could not hold them in RAM. Latency is higher than in-memory HNSW but the cost curve is dramatically better. Several systems now expose this, including as an extension to Postgres.

### Index comparison

| Index | Recall | Query latency | Memory | Build time | Handles updates | Use when |
|---|---|---|---|---|---|---|
| Flat | Exact | Linear in N | Vectors only | None | Trivially | Under ~100k vectors, or as ground truth |
| IVF | Tunable, good | Low | Low overhead | Fast, needs training | Moderate | Large collections, memory constrained |
| IVF + PQ | Moderate, needs rescoring | Very low | Very low | Fast | Moderate | Billion-scale on limited RAM |
| HNSW | Very high | Very low | High overhead | Slow | Poor for deletes | The default for most workloads |
| HNSW + scalar quant | High | Very low | Reduced ~4x | Slow | Poor for deletes | Millions of vectors, cost-sensitive |
| Binary + rescore | Good with oversampling | Extremely low | Reduced ~32x | Moderate | Moderate | High-dimensional, very large, latency-critical |
| Disk-based graph | High | Moderate | Low RAM, high disk | Slow | Moderate | Billion-scale on commodity hardware |

## Why does filtering break vector search?

Because the ANN index is built over the whole collection, not over the filtered subset. Post-filtering retrieves the top k by similarity and then discards results failing the filter, so a selective filter can return almost nothing. Pre-filtering is correct but expensive. Integrated filtering applies the predicate during traversal and is what the better systems do.

Pure similarity search is a solved problem. Similarity search constrained by metadata — this tenant, published after this date, status active, department engineering — is where systems differ most, and where naive implementations fail badly.

**Post-filtering** searches for the top k by similarity, then discards results failing the filter. Fast, and it silently breaks. Ask for ten results with a filter matching one percent of the corpus and you may get zero, because none of the hundred nearest neighbors happened to match.

**Pre-filtering** determines the matching subset first, then searches only within it. Correct, and expensive when the subset is large, because ANN indexes are built over the whole collection and cannot be trivially restricted.

**Integrated filtering** applies the predicate during graph traversal, so the search only visits qualifying nodes. This is what the better systems do, and it is a genuine engineering differentiator. The complication is graph connectivity: if the filter is highly selective, the qualifying nodes may not be reachable from each other, and the search stalls. Mature implementations detect this and fall back to exact search over the filtered subset, which is fast precisely because the subset is small.

When evaluating a vector database, test filtered queries at several selectivity levels — one percent, ten percent, fifty percent — not just unfiltered ones. Unfiltered benchmarks are close to meaningless for production RAG, where nearly every query carries a permission or recency constraint.

### What is hybrid search?

Dense retrieval blurs exact tokens; keyword retrieval nails them. Production retrieval runs both and fuses the results, typically with reciprocal rank fusion. Systems with native hybrid support — a single query returning fused results — save you from maintaining two stores and reconciling them. Our guide to [retrieval-augmented generation](/articles/what-is-rag/) covers why this matters more than any index-level optimization.

## Scale and operations

### Sharding and replication

Sharding splits the collection across nodes; each shard holds an independent index, queries fan out, and results merge. It addresses collections too large for one machine. Replication copies shards for throughput and availability. The two are orthogonal and both are usually needed.

The subtlety is that ANN recall is affected by sharding: each shard returns its local top k, and the merged result is not necessarily the global top k. Requesting more results per shard than you need mitigates this.

### Index builds are a batch job

Building an HNSW index over tens of millions of vectors takes hours and saturates CPU. Treat it as a pipeline stage, not an online operation. Systems that separate storage from compute let you build on ephemeral capacity and serve from cheaper nodes.

### How should you isolate tenants?

Three approaches, with different failure modes. A metadata field per tenant is simplest and depends entirely on filtered search performing well. A separate collection or namespace per tenant gives clean isolation and stops scaling somewhere in the thousands of tenants. Partitioned indexes within one collection are the middle ground several systems now offer specifically for this.

Pick deliberately. Retrofitting tenant isolation onto a shared index after a compliance review is a painful migration.

### Freshness

Some systems index synchronously on write; others batch. If your application writes a document and immediately queries for it — common in agent workflows — verify the visibility guarantee rather than assuming it.

## What are the main options?

pgvector for teams already running Postgres, Qdrant when metadata filtering is central, Weaviate when you want the database to own the embedding step, Pinecone when you want no operational burden, Milvus at genuinely large scale, Chroma for prototypes, and LanceDB when your data lives in object storage. Each is described below.

**pgvector** adds vector types and HNSW/IVFFlat indexes to Postgres. Its advantage is not raw speed but locality: vectors sit in the same transactional database as your relational data, so filters and joins are ordinary SQL and there is no second system to keep in sync. Companion extensions add DiskANN-style indexing and streaming filtered search. For most teams under ten million vectors who already run Postgres, this is the correct default.

**Qdrant** is a Rust-based dedicated engine with strong filtered search, a full range of quantization options including binary, on-disk storage modes and a clean API. A good choice when metadata filtering is central and you want predictable behavior under selective queries.

**Weaviate** is a Go-based engine with native hybrid search, a module system for embedding generation at ingest, and mature multi-tenancy. Attractive when you want the database to own the embedding step.

**Pinecone** is fully managed and proprietary, with a serverless model that separates storage from compute and bills by usage. You give up control and portability; you get no operational burden. For teams without infrastructure engineers, that is often the right trade.

**Milvus** is a distributed system built for very large deployments, with the widest range of index types including GPU-accelerated options. The most operationally complex option, and appropriate at genuinely large scale or via its managed service.

**Chroma** targets development ergonomics — embedded mode, minimal setup, a simple API. Excellent for prototypes and small applications, and most teams migrate as scale grows.

**LanceDB** is embedded and built on a columnar file format designed for object storage, giving versioning, zero-copy reads and good multimodal support. Compelling when data lives in S3 and you want to avoid running a server.

### Adjacent systems worth knowing

Also worth knowing: **Elasticsearch** and **OpenSearch** combine vector search with mature BM25 and are the obvious answer if you already operate them; **Vespa** offers the most sophisticated ranking and hybrid capabilities at the cost of a steep learning curve; **FAISS** is a library rather than a database and remains the reference implementation for index research; and several object-storage-native services now offer very low cost per stored vector for workloads that tolerate higher latency.

## How do you choose a vector database?

Answer four questions in order: how many vectors you will realistically hold in eighteen months, whether you already run Postgres, how selective your filters are, and who operates the thing. Under a million vectors almost anything works, so optimize for operational simplicity. If you already run Postgres and are in the first two size bands, pgvector is usually the answer.

**1. How many vectors, realistically, in eighteen months?** Under a million, almost anything works — optimize for operational simplicity. One to fifty million is the mainstream band where pgvector and the dedicated engines all compete. Above that, you are choosing between distributed systems and disk-based indexes.

**2. Do you already run Postgres?** If yes, and you are in the first two bands, use pgvector unless you have a specific reason not to. Eliminating a second datastore, its sync pipeline and its failure modes is worth more than a marginal latency improvement.

**3. How selective are your filters?** If every query carries a tenant id, permission scope or date range that eliminates most of the corpus, filtered search performance is your primary criterion. Benchmark it directly at your real selectivity.

**4. Who operates it?** Without dedicated infrastructure capacity, take the managed option. The total cost of an unmanaged cluster is not the license.

### What not to optimize for

Two things not to optimize for. Benchmark charts published by vendors measure unfiltered queries on uniform synthetic data and will not predict your workload. And index type matters far less than retrieval design — chunking, hybrid search and reranking move quality much more than swapping HNSW parameters.

```sql
-- pgvector: index, then query with a metadata filter in one statement
CREATE TABLE chunks (
  id          bigserial PRIMARY KEY,
  document_id bigint NOT NULL,
  tenant_id   bigint NOT NULL,
  published   date   NOT NULL,
  content     text   NOT NULL,
  embedding   vector(1024) NOT NULL
);

CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX ON chunks (tenant_id, published);

SET hnsw.ef_search = 100;

SELECT id, content, 1 - (embedding <=> $1) AS similarity
FROM chunks
WHERE tenant_id = $2
  AND published >= now() - interval '18 months'
ORDER BY embedding <=> $1
LIMIT 20;
```

The `<=>` operator is cosine distance, so `1 - distance` gives similarity. Note that `ef_search` is a session setting: raise it to trade latency for recall on important queries and lower it for bulk work.

```python
# Measuring recall against an exact baseline — do this before tuning anything
def recall_at_k(index, exact, queries, k: int = 10) -> float:
    hits = 0
    for q in queries:
        approx = set(index.search(q, k=k))
        truth  = set(exact.search(q, k=k))
        hits  += len(approx & truth) / k
    return hits / len(queries)

# Sweep the runtime parameter and pick the knee of the curve
for ef in (32, 64, 128, 256, 512):
    index.set_ef_search(ef)
    print(ef, recall_at_k(index, exact_index, sample_queries))
```

Run that sweep on your own data. Published defaults are chosen for benchmark datasets whose distribution is nothing like a corpus of support tickets or contracts.

## The bottom line

A vector database is an ANN index with metadata handling attached. Choose the metric your embedding model was trained with, start with HNSW, add scalar or binary quantization when memory becomes the constraint, and measure recall against an exact baseline rather than trusting defaults.

Weight filtered search performance heavily, because production queries are almost always filtered, and weight operational simplicity above marginal latency. If you already run Postgres and are under ten million vectors, pgvector is very likely the answer.

Then spend the time you saved on retrieval quality. The index rarely determines whether your system returns the right passage — chunking, hybrid search and reranking do, as do the [agent architectures](/articles/best-ai-agents/) built on top of them.

More in the [vector databases category](/category/vector-databases/), and see our [OpenAI API tutorial](/articles/openai-api-tutorial/) for generating the embeddings themselves.
