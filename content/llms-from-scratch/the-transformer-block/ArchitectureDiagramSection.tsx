import { TransformerBlockDiagram } from "@/components/blog/interactive/transformer-block-diagram";

export function ArchitectureDiagramSection() {
  return (
    <section>
      <h2
        id="architecture-diagram-piece-by-piece"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The architecture diagram, piece by piece
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Open a diagram of a large language model and it looks like a wall of boxes stacked
        impossibly high, GPT-3 stacks 96 of them. It&apos;s tempting to assume each box does
        something fundamentally different, that layer 40 is computing something layer 41
        isn&apos;t. It isn&apos;t. Every one of those boxes is the exact same unit, repeated, each
        copy with its own independently learned weights. That repeating unit is the{" "}
        <strong>transformer block</strong>, and once you&apos;ve understood one, you&apos;ve
        understood the architecture.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A transformer block has exactly two computational sublayers. <strong>Multi-head
        attention</strong>, the mechanism from the previous article, which lets every token pull
        information from every other token. And a <strong>feedforward network</strong>, covered
        later in this one, which processes what attention gathered. Each sublayer gets wrapped in
        the same packaging, a layer norm before it, and a residual connection around it that adds
        the sublayer&apos;s input back onto its output. Follow one token&apos;s vector through a
        single block and it passes through the same eight steps in the same order: layer norm,
        attention, add the residual, layer norm again, feedforward, add the residual again.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The diagram below is that exact sequence, laid out top to bottom. Click through each stage
        before the rest of this article covers attention and feedforward in depth, it&apos;s
        worth having the whole shape in view first.
      </p>

      <TransformerBlockDiagram />

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Notice two stages show up twice, layer norm and the residual add. That repetition
        isn&apos;t an accident. It&apos;s the identical fix applied around each sublayer
        independently, and the last section of this article covers exactly why a stack this deep
        needs that fix at all.
      </p>
    </section>
  );
}
