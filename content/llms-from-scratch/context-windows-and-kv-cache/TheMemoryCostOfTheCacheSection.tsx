export function TheMemoryCostOfTheCacheSection() {
  return (
    <section>
      <h2
        id="the-memory-cost-of-the-cache"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The memory cost of the cache itself
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s easy to read the previous section and think the KV cache is a clean win, more
        speed, no downside. It&apos;s a trade, not a discount: it buys back compute by spending
        memory, and that memory bill is a real, growing number that sits on a GPU for as long as
        the conversation stays open.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The cache has to store one key vector and one value vector, per token, per layer, per
        attention head. That&apos;s four multipliers stacked on top of sequence length: two vectors
        (key and value), times the number of layers, times the number of heads, times however many
        bytes each number takes up. Sequence length is the only one of those that grows as the
        conversation goes on, but it&apos;s multiplied by three constants that are already large in
        any real model.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Take a 7B-parameter-class model as a concrete example: 32 layers, 32 attention heads, a
        128-dimension head size (4,096 hidden size total), weights stored in fp16, 2 bytes per
        number. Per token, the cache needs 2 (key and value) &times; 32 layers &times; 32 heads
        &times; 128 dimensions &times; 2 bytes, which comes out to 512 KB, per token, before the
        conversation has produced a single reply. At 1,024 tokens of conversation, that&apos;s about
        512 MB. At 4,096 tokens, about 2 GB. At 32,768 tokens, about 16 GB, and that&apos;s one
        conversation, held by one user, for as long as that chat stays active.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        That 16 GB number is worth sitting with. The model&apos;s own weights, for this same
        7B-class model in fp16, are only around 14 GB, loaded once and shared across every request
        being served. A handful of long, active conversations can carry more memory in KV caches
        than the model itself takes up. This is frequently the actual ceiling on how many
        simultaneous conversations a server can serve, not the size of the model&apos;s weights.
        Providers don&apos;t under-provision GPUs by accident, the KV cache is where a server&apos;s
        memory budget quietly disappears.
      </p>
    </section>
  );
}
