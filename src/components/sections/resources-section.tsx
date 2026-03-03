import { useReveal } from "@/hooks/use-reveal"
import Icon from "@/components/ui/icon"

const RESOURCES = [
  {
    category: "Статьи",
    items: [
      { title: "ИИ в образовании: мировой опыт", source: "UNESCO", url: "https://www.unesco.org/en/digital-education/artificial-intelligence" },
      { title: "Этика ИИ — базовые принципы", source: "Яндекс Практикум", url: "https://practicum.yandex.ru" },
      { title: "Как не стать зависимым от нейросетей", source: "Habr", url: "https://habr.com" },
    ],
  },
  {
    category: "Инструменты ИИ для учёбы",
    items: [
      { title: "ChatGPT — помощник в объяснении тем", source: "OpenAI", url: "https://chat.openai.com" },
      { title: "GigaChat — российский ИИ-ассистент", source: "Сбер", url: "https://developers.sber.ru/portal/products/gigachat" },
      { title: "Wolfram Alpha — точные вычисления", source: "Wolfram", url: "https://www.wolframalpha.com" },
    ],
  },
  {
    category: "Официальные документы",
    items: [
      { title: "Рекомендации ЮНЕСКО по этике ИИ", source: "UNESCO, 2021", url: "https://unesdoc.unesco.org/ark:/48223/pf0000381137_rus" },
      { title: "Национальная стратегия ИИ России", source: "Правительство РФ", url: "http://government.ru/docs/37700/" },
      { title: "Кодекс этики в сфере ИИ", source: "Альянс в сфере ИИ", url: "https://a-ai.ru/codex" },
    ],
  },
]

export function ResourcesSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-10 transition-all duration-700 md:mb-14 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Ресурсы
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Полезные материалы</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {RESOURCES.map((group, gi) => (
            <div
              key={gi}
              className={`transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${gi * 150}ms` }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-foreground/15" />
                <span className="font-mono text-xs text-foreground/50">{group.category}</span>
              </div>
              <div className="space-y-4">
                {group.items.map((item, ii) => (
                  <a
                    key={ii}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-3 border-b border-foreground/8 pb-3 transition-all hover:border-foreground/25"
                  >
                    <div>
                      <p className="mb-0.5 text-sm font-light text-foreground transition-colors group-hover:text-foreground/80 md:text-base">
                        {item.title}
                      </p>
                      <p className="font-mono text-xs text-foreground/40">{item.source}</p>
                    </div>
                    <Icon
                      name="ArrowUpRight"
                      size={14}
                      className="mt-1 shrink-0 text-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground/60"
                    />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
