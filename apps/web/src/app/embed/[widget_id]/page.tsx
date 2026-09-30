import ChidiWidgetUI from "@/components/widget/ChidiWidgetUI";

export default async function EmbedPage({ params }: { params: Promise<{ widget_id: string }> }) {
  const { widget_id } = await params;
  return <ChidiWidgetUI widgetId={widget_id} />;
}
