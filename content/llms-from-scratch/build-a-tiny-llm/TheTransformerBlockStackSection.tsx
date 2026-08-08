import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheTransformerBlockStackSection() {
  return (
    <section>
      <h2
        id="the-transformer-block-stack"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The transformer block stack
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        It&apos;s easy to look at a transformer architecture diagram and assume the block itself is
        some new invention, a fifth fundamental operation sitting alongside attention and
        feedforward layers. It isn&apos;t. Everything in this section is the weighted sum from the
        Attention article and the stacked linear-plus-nonlinearity layers from Neural Network
        Foundations, wrapped in exactly two addition operations and two calls to{" "}
        <code>LayerNorm</code>. The Transformer Block article called that wrapping load-bearing,
        and it is, but it isn&apos;t new arithmetic. It&apos;s assembly.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Start with multi-head attention itself, the query-key-value mechanism from the Attention
        article, run several times in parallel with independently learned projections, then
        concatenated back together. One addition here that article&apos;s toy example skipped for
        clarity: a causal mask. Token 5 can attend to tokens 0 through 5, never to token 6 or
        beyond, otherwise the model would be predicting the next token by looking at it directly.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Causal multi-head self-attention
        </p>
        <CodeBlock
          code={`import math
import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int, block_size: int, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.head_dim = d_model // n_heads

        self.qkv_proj = nn.Linear(d_model, 3 * d_model)
        self.out_proj = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)

        # token t can only attend to tokens <= t
        mask = torch.tril(torch.ones(block_size, block_size))
        self.register_buffer("mask", mask)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, C = x.shape
        q, k, v = self.qkv_proj(x).split(C, dim=-1)

        # (B, T, C) -> (B, n_heads, T, head_dim), one slice per head
        q = q.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)
        k = k.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)
        v = v.view(B, T, self.n_heads, self.head_dim).transpose(1, 2)

        scores = q @ k.transpose(-2, -1) / math.sqrt(self.head_dim)
        scores = scores.masked_fill(self.mask[:T, :T] == 0, float("-inf"))
        weights = self.dropout(F.softmax(scores, dim=-1))

        out = weights @ v
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.out_proj(out)`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Attention on its own is a weighted average, a linear combination of value vectors. Neural
        Network Foundations covered why stacking linear operations without a nonlinearity between
        them collapses into a single linear operation, no additional expressive power gained.
        That&apos;s exactly why a feedforward layer follows every attention layer, a widen-then-project
        stack with a nonlinearity in between: the same neuron-and-activation-function machinery from
        that article, applied identically to every token position.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Position-wise feedforward layer
        </p>
        <CodeBlock
          code={`class FeedForward(nn.Module):
    def __init__(self, d_model: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)`}
          output={``}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Now the assembly The Transformer Block article walked through: attention and feedforward,
        each wrapped in a residual connection, addition rather than replacement, plus a{" "}
        <code>LayerNorm</code> before each one to keep activations from drifting as they pass
        through six stacked copies of this block.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          One transformer block: attention + feedforward + residuals + norm
        </p>
        <CodeBlock
          code={`class TransformerBlock(nn.Module):
    def __init__(self, d_model: int, n_heads: int, d_ff: int, block_size: int, dropout: float = 0.1):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, n_heads, block_size, dropout)
        self.ln2 = nn.LayerNorm(d_model)
        self.ff = FeedForward(d_model, d_ff, dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x + self.attn(self.ln1(x))
        x = x + self.ff(self.ln2(x))
        return x`}
          output={``}
        />
      </div>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>Caveat:</strong> production models refine this block in ways that don&apos;t
          change its shape. RMSNorm instead of <code>LayerNorm</code>, rotary position embeddings
          instead of the learned table from the previous section, grouped-query attention instead of
          full multi-head, dozens of other ablation-tested variants. None of that changes the
          argument here, it changes constants. This is the block the original transformer paper
          described, and it&apos;s still recognizably what most production models are built from.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Stack six of these, add a final <code>LayerNorm</code>, and project back from{" "}
        <code>d_model</code> down to <code>vocab_size</code>, and the model is complete: input
        token IDs in, one logit per vocabulary entry out, for every position in the sequence.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          TinyGPT: the full model
        </p>
        <CodeBlock
          code={`class TinyGPT(nn.Module):
    def __init__(
        self,
        vocab_size: int,
        d_model: int = 128,
        n_heads: int = 4,
        n_layers: int = 6,
        block_size: int = 128,
        dropout: float = 0.1,
    ):
        super().__init__()
        self.block_size = block_size
        self.embed = TokenAndPositionEmbedding(vocab_size, d_model, block_size)
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, n_heads, 4 * d_model, block_size, dropout)
            for _ in range(n_layers)
        ])
        self.ln_final = nn.LayerNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
        self.lm_head.weight = self.embed.token_emb.weight  # weight tying

    def forward(self, token_ids: torch.Tensor) -> torch.Tensor:
        x = self.embed(token_ids)          # (B, T, d_model)
        for block in self.blocks:
            x = block(x)                   # (B, T, d_model)
        x = self.ln_final(x)
        logits = self.lm_head(x)           # (B, T, vocab_size)
        return logits


model = TinyGPT(vocab_size=tokenizer.vocab_size)
n_params = sum(p.numel() for p in model.parameters())
print(f"{n_params:,} parameters")`}
          output={`1,214,592 parameters`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        One detail worth pausing on: <code>lm_head.weight</code> is set equal to the token
        embedding&apos;s weight, not copied, the same tensor, shared. The row of numbers the model
        uses to represent a token going in is literally reused as the row of numbers it uses to
        score that token coming out. Fewer parameters to learn, and a representation that has to
        pull double duty, which in practice makes it a better one.
      </p>
    </section>
  );
}
