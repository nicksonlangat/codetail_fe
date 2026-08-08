import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TokenizerAndEmbeddingsSection() {
  return (
    <section>
      <h2
        id="tokenizer-and-embeddings"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Tokenizer and embeddings, wired together
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s tempting to reach straight for a real byte-pair encoder, the Tokenization article
        covered exactly how one is built, learned merges and all. But a full BPE vocabulary is
        built to handle open-domain text efficiently, and that&apos;s not the constraint here. The
        toy corpus for this build is a plain text file a few hundred kilobytes in size, doesn&apos;t
        matter what it contains, and a tokenizer&apos;s job, however it&apos;s implemented, is
        unchanged from that article: turn text into integers and back. So the simplest tokenizer
        that does that job honestly is a character-level one, every unique character in the corpus
        gets one integer ID. Same interface as a BPE tokenizer, encode and decode, just a coarser
        vocabulary.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Character-level tokenizer
        </p>
        <CodeBlock
          code={`class CharTokenizer:
    """Simplest possible stand-in for the BPE tokenizer from the
    Tokenization article. Same job, text to integers and back, a coarser
    vocabulary: one entry per unique character instead of learned merges."""

    def __init__(self, text: str):
        chars = sorted(set(text))
        self.vocab_size = len(chars)
        self.stoi = {ch: i for i, ch in enumerate(chars)}
        self.itos = {i: ch for i, ch in enumerate(chars)}

    def encode(self, text: str) -> list[int]:
        return [self.stoi[ch] for ch in text]

    def decode(self, ids: list[int]) -> str:
        return "".join(self.itos[i] for i in ids)


text = open("corpus.txt").read()
tokenizer = CharTokenizer(text)
print(tokenizer.vocab_size)
print(tokenizer.encode("hello"))`}
          output={`65
[46, 43, 50, 50, 53]`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code>vocab_size</code> here comes out to 65 for a typical English corpus, uppercase and
        lowercase letters, punctuation, whitespace. That number matters, it&apos;s the input
        dimension of the embedding table built next, and it&apos;s referenced again unchanged all
        the way through the output projection at the far end of the model.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The Embeddings article established that an embedding table is, mechanically, a lookup
        table: one row of learned numbers per vocabulary entry, and <code>nn.Embedding</code> is
        exactly that, nothing more exotic than an indexable matrix that gradients flow into during
        training. Token ID 46 doesn&apos;t mean anything on its own, it&apos;s an address. The row
        at that address is what carries meaning, and that row gets updated every time backpropagation
        runs, the same way it would for a 100,000-entry BPE vocabulary.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        On its own, a token embedding can&apos;t tell &ldquo;cat sat&rdquo; from &ldquo;sat
        cat,&rdquo; the vectors get looked up identically regardless of position. That&apos;s the
        gap the Positional Encoding article closed. This build uses the simpler of the two options
        that article covered, a learned position embedding table instead of a fixed sinusoidal one,
        one row per position from 0 up to <code>block_size</code>. Simpler to reason about, same
        purpose: give the model a way to tell first token from fifth from fiftieth.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Token embedding + learned positional embedding
        </p>
        <CodeBlock
          code={`import torch
import torch.nn as nn

class TokenAndPositionEmbedding(nn.Module):
    def __init__(self, vocab_size: int, d_model: int, block_size: int):
        super().__init__()
        self.token_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(block_size, d_model)

    def forward(self, token_ids: torch.Tensor) -> torch.Tensor:
        B, T = token_ids.shape
        positions = torch.arange(T, device=token_ids.device)
        # broadcast: (T, d_model) added onto every row in the batch
        return self.token_emb(token_ids) + self.pos_emb(positions)`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Wiring the two pieces together end to end, a batch of raw text turns into a batch of
        position-aware vectors in two calls:
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Text to tensor to embedded sequence
        </p>
        <CodeBlock
          code={`d_model = 128
block_size = 128

embed = TokenAndPositionEmbedding(tokenizer.vocab_size, d_model, block_size)

batch_text = ["to be or not to", "the trophy did"]
token_ids = torch.tensor([tokenizer.encode(t) for t in batch_text])  # (B, T)
x = embed(token_ids)                                                # (B, T, d_model)
print(x.shape)`}
          output={`torch.Size([2, 15, 128])`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        <code>x</code> is now a batch of shape <code>(B, T, d_model)</code>, one 128-dimensional
        vector per token, position baked in by addition rather than left implicit. Every downstream
        piece in this article, every transformer block, the loss function, the sampling loop, only
        ever operates on tensors of this shape. Get this part right and the rest is composition.
      </p>
    </section>
  );
}
