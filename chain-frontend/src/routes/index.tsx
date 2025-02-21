import { createFileRoute } from "@tanstack/react-router";

function IndexPage() {
  return <div className="mt-8">Сервис недоступен</div>;
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
