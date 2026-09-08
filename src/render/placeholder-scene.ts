export function renderPlaceholderScene(canvas: HTMLCanvasElement): () => void {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a 2D rendering context.");
  }

  let animationFrame = 0;

  const renderFrame = (): void => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    animationFrame = window.requestAnimationFrame(renderFrame);
  };

  renderFrame();

  return () => window.cancelAnimationFrame(animationFrame);
}
