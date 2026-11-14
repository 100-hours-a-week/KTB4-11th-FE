// 브라우저가 해석한 CSS 색상을 차트가 지원하는 sRGB RGBA로 정규화한다.
export function toChartColor(color: string, opacity = 1): string {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context)
    throw new Error("차트 색상 변환을 위한 Canvas를 생성할 수 없어요");
  if (!CSS.supports("color", color))
    throw new Error(`유효하지 않은 차트 색상: ${color}`);

  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${(a / 255) * opacity})`;
}
