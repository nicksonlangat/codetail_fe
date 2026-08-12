import { CodeBlock } from "@/components/blog/interactive/code-block";

export function BeforeMatchSection() {
  return (
    <section>
      <h2
        id="before-match"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The isinstance ladder
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Branching on the shape or type of a value in pre-3.10 Python meant one of two things: a
        chain of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          if/elif isinstance()
        </code>{" "}
        blocks, or a dispatch dict. Both work. Neither scales.
      </p>

      <CodeBlock
        code={`# The isinstance ladder: type check, then extract, then act
def handle_event(event):
    if isinstance(event, MouseClick):
        x, y = event.x, event.y
        if event.button == "left":
            handle_left_click(x, y)
        elif event.button == "right":
            handle_right_click(x, y)
    elif isinstance(event, KeyPress):
        if event.key == "Escape":
            close_dialog()
        elif event.key == "Enter":
            submit_form()
        else:
            buffer.append(event.key)
    elif isinstance(event, WindowResize):
        width, height = event.width, event.height
        reflow(width, height)
    else:
        raise ValueError(f"unknown event: {event!r}")`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Three problems. First, you check the type and extract the data in separate steps. Second,
        the nesting grows with every condition. Third, the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">else</code>{" "}
        at the bottom is your only exhaustiveness check, and it only fires at runtime.
      </p>

      <CodeBlock
        code={`# The dict dispatch version: flatter, but loses access to event fields
def handle_mouse_click(event): ...
def handle_key_press(event): ...
def handle_resize(event): ...

handlers = {
    "MouseClick": handle_mouse_click,
    "KeyPress":   handle_key_press,
    "WindowResize": handle_resize,
}

def handle_event(event):
    handler = handlers.get(type(event).__name__)
    if handler is None:
        raise ValueError(f"unknown event: {event!r}")
    handler(event)  # still have to unpack inside each handler`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The dict version reduces nesting but does not fix the core problem: matching and
        destructuring are separate operations. You know what type you have before you can extract
        what you need from it.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          match/case
        </code>{" "}
        does both at once.
      </p>
    </section>
  );
}
