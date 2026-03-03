import { useReveal } from "@/hooks/use-reveal"
import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const API_URL = "https://functions.poehali.dev/fdc5e546-6d94-4f3a-bcc1-49c208be65c8"

const POLL_OPTIONS = [
  { key: "positive", label: "Полностью за", desc: "ИИ — это прогресс, нужно использовать" },
  { key: "depends", label: "Зависит от ситуации", desc: "Всё хорошо в меру" },
  { key: "neutral", label: "Нейтрально", desc: "Пока не определился" },
  { key: "negative", label: "Против", desc: "Риски перевешивают пользу" },
]

interface PollResults {
  results: Record<string, number>
  total: number
}

export function DiscussionSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [voted, setVoted] = useState<string | null>(null)
  const [pollData, setPollData] = useState<PollResults>({ results: {}, total: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}?action=get_poll`)
      .then((r) => r.json())
      .then(setPollData)
      .catch(() => {})
  }, [])

  const vote = async (key: string) => {
    if (voted || loading) return
    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote", option: key }),
      })
      const data = await res.json()
      setPollData(data)
      setVoted(key)
    } catch (_e) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const getPercent = (key: string) => {
    if (!pollData.total) return 0
    return Math.round(((pollData.results[key] || 0) / pollData.total) * 100)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <div
              className={`mb-8 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
                Дискуссия
              </h2>
              <p className="font-mono text-sm text-foreground/60 md:text-base">/ Ваше мнение важно</p>
            </div>

            <div
              className={`mb-4 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <p className="mb-6 text-sm leading-relaxed text-foreground/80 md:text-base">
                Как вы относитесь к использованию ИИ в школе?
              </p>
              <div className="space-y-3">
                {POLL_OPTIONS.map((opt, i) => {
                  const pct = getPercent(opt.key)
                  const isChosen = voted === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => vote(opt.key)}
                      disabled={!!voted || loading}
                      className={`group relative w-full overflow-hidden rounded-none border-b py-3 text-left transition-all duration-300 ${
                        isChosen
                          ? "border-foreground/60"
                          : "border-foreground/15 hover:border-foreground/40"
                      }`}
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      {voted && (
                        <div
                          className="absolute inset-y-0 left-0 bg-foreground/8 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      )}
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="font-sans text-sm font-medium text-foreground md:text-base">{opt.label}</p>
                          <p className="font-mono text-xs text-foreground/50">{opt.desc}</p>
                        </div>
                        {voted ? (
                          <span className="font-mono text-sm text-foreground/70">{pct}%</span>
                        ) : (
                          <Icon name="ChevronRight" size={14} className="text-foreground/30 transition-transform group-hover:translate-x-1" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
              {pollData.total > 0 && (
                <p className="mt-3 font-mono text-xs text-foreground/40">
                  Всего голосов: {pollData.total}
                </p>
              )}
            </div>
          </div>

          <div
            className={`flex flex-col justify-center space-y-6 transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="border-l border-foreground/20 pl-6">
              <h3 className="mb-3 font-sans text-xl font-light text-foreground md:text-2xl">Мини-викторина</h3>
              <Quiz />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const QUIZ = [
  {
    q: "Что такое «этичный ИИ»?",
    options: [
      "ИИ, который никогда не ошибается",
      "ИИ, действующий честно, безопасно и с учётом прав человека",
      "ИИ, который разработан только учёными",
    ],
    correct: 1,
  },
  {
    q: "Что НЕ является этическим принципом ИИ?",
    options: ["Прозрачность", "Ответственность", "Максимальная скорость ответа"],
    correct: 2,
  },
  {
    q: "Если ученик использует ИИ для написания сочинения — это...",
    options: [
      "Всегда допустимо",
      "Зависит от правил школы и того, как используется",
      "Всегда запрещено",
    ],
    correct: 1,
  },
]

function Quiz() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = QUIZ[step]

  const choose = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correct) setScore((s) => s + 1)
    setTimeout(() => {
      if (step + 1 >= QUIZ.length) {
        setDone(true)
      } else {
        setStep((s) => s + 1)
        setSelected(null)
      }
    }, 900)
  }

  const reset = () => {
    setStep(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="font-sans text-3xl font-light text-foreground">{score}/{QUIZ.length}</p>
        <p className="text-sm text-foreground/70">
          {score === QUIZ.length
            ? "Отлично! Вы хорошо разбираетесь в теме."
            : score >= 2
            ? "Хорошо! Есть что ещё изучить."
            : "Советуем изучить раздел «Принципы»."}
        </p>
        <button
          onClick={reset}
          className="font-mono text-xs text-foreground/50 underline underline-offset-4 hover:text-foreground/80 transition-colors"
        >
          Пройти снова
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="font-mono text-xs text-foreground/40">{step + 1} / {QUIZ.length}</p>
      <p className="text-sm leading-relaxed text-foreground/90 md:text-base">{q.q}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct
          const isSelected = selected === i
          let cls = "w-full border-b border-foreground/15 py-2 text-left font-mono text-xs text-foreground/70 transition-all hover:text-foreground"
          if (selected !== null) {
            if (isCorrect) cls += " !text-foreground border-foreground/60"
            else if (isSelected) cls += " !text-foreground/30 line-through"
          }
          return (
            <button key={i} onClick={() => choose(i)} className={cls}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}