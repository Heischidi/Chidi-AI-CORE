import ChidiWidgetUI from "@/components/widget/ChidiWidgetUI";

export default function EmbedPage({ params }: { params: { widget_id: string } }) {
  return <ChidiWidgetUI widgetId={params.widget_id} />;
}
