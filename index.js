class QuoteApp {
  quotes = [
    { id: 1, text: 'Не ошибается тот, кто ничего не делает.', author: 'Теодор Рузвельт' },
    {
      id: 2,
      text: 'Жизнь - это то, что с тобой происходит, пока ты строишь планы.',
      author: 'Джон Леннон'
    },
    {
      id: 3,
      text: 'Секрет успеха - это настойчивость в достижении цели.',
      author: 'Бенджамин Дизраэли'
    },
    {
      id: 4,
      text: 'Будь тем изменением, которое ты хочешь увидеть в мире',
      author: 'Махатма Ганди'
    },
    {
      id: 5,
      text: 'Сложнее всего начать действовать, все остальное зависит только от упорства.',
      author: 'Амелия Эрхарт'
    },
    { id: 6, text: 'Надо любить жизнь больше, чем смысл жизни.', author: 'Федор Достоевский' },
    {
      id: 7,
      text: 'Наука — это организованные знания, мудрость — это организованная жизнь.',
      author: 'Иммануил Кант'
    },
    {
      id: 8,
      text: 'Два самых важных дня в твоей жизни: день, когда ты появился на свет, и день, когда понял, зачем.',
      author: 'Марк Твен'
    },
    {
      id: 9,
      text: ' Есть только один способ избежать критики: ничего не делайте, ничего не говорите и будьте никем.',
      author: 'Аристотель'
    },
    {
      id: 10,
      text: 'Лучше быть уверенным в хорошем результате, чем надеяться на отличный.',
      author: 'Уоррен Баффет'
    }
  ]

  constructor() {
    this.newQuoteButton = document.querySelector('[data-new-quote-button]')
    this.item = document.querySelector('[data-item]')
    this.message = document.querySelector('[data-message]')
    this.saveButton = document.querySelector('[data-save-quote-button]')
    this.showSavedQuotesButton = document.querySelector('[data-show-saved-quote-button]')
    this.savedQuotesContainer = document.querySelector('[data-saved-quotes]')
    this.deleteSavedQuote = document.querySelector('[data-delete-saved-quote]')

    this.newQuoteButton.addEventListener('click', () => this.displayQuote())
    this.saveButton.addEventListener('click', () => this.saveQuote())
    this.showSavedQuotesButton.addEventListener('click', () => this.toggleButton())
    this.savedQuotesContainer.addEventListener('click', (event) => this.handleDelete(event))
  }

  getRandomQuote() {
    return this.quotes[Math.floor(Math.random() * this.quotes.length)]
  }

  displayQuote() {
    this.item.innerHTML = this.markupQuote(this.getRandomQuote())
  }

  markupQuote(quote) {
    return `
      <div data-id="${quote.id}">
        <p class="quote">${quote.text}</p>
        <p class="author">${quote.author}</p>
      </div>
    `
  }

  markupSavedQuote(quote) {
    return `
    <div class="saved-quote" data-id="${quote.id}">
      <div>
        <p class="quote">${quote.text}</p>
        <p class="author">${quote.author}</p>
      </div>
      <button class="delete-button" data-delete-saved-quote>Удалить</button>
    </div>
  `
  }

  getSavedQuoteIds() {
    return JSON.parse(localStorage.getItem('quoteIds')) || []
  }

  setSavedQuoteIds(ids) {
    localStorage.setItem('quoteIds', JSON.stringify(ids))
  }

  showMessage = (text, color) => {
    this.message.textContent = text
    this.message.style.color = color

    if (text.length === 0) this.message.innerHTML = ''
  }

  saveQuote() {
    const savedQuotesIds = this.getSavedQuoteIds()
    const quote = this.item.querySelector('[data-id]')

    if (!quote) {
      this.showMessage('Цитата не сгенерирована', 'red')
      this.newQuoteButton.addEventListener('click', () => this.showMessage(''))
      return
    }

    const quoteId = quote.dataset.id

    if (savedQuotesIds.includes(quoteId)) {
      this.showMessage('Цитата уже была сохранена', 'red')
      this.newQuoteButton.addEventListener('click', () => this.showMessage(''))
      return
    }

    savedQuotesIds.push(quoteId)
    this.setSavedQuoteIds(savedQuotesIds)
    this.showMessage('Цитата сохранена', 'green')

    if (this.isSavedQuotesVisible()) {
      this.updateSavedQuotesList()
    }
  }

  isSavedQuotesVisible() {
    return this.showSavedQuotesButton.dataset.show === 'show'
  }

  toggleButton() {
    const isVisible = this.isSavedQuotesVisible()
    this.showSavedQuotesButton.dataset.show = isVisible ? 'none' : 'show'
    this.showSavedQuotesButton.innerHTML = isVisible
      ? 'Показать сохраненные цитаты'
      : 'Скрыть сохраненные цитаты'

    this.savedQuotesContainer.style.display = isVisible ? 'none' : 'block'

    this.updateSavedQuotesList()
  }

  updateSavedQuotesList() {
    const savedQuotesIds = this.getSavedQuoteIds().map(Number)
    const filteredQuotes = this.quotes.filter((q) => savedQuotesIds.includes(q.id))

    this.savedQuotesContainer.innerHTML = filteredQuotes.length
      ? filteredQuotes.map(this.markupSavedQuote).join('')
      : '<p class="warning">Вы еще не сохранили ни одной цитаты</p>'
  }

  deleteQuote(quoteId) {
    const savedQuotesIds = this.getSavedQuoteIds().filter((id) => id !== quoteId.toString())
    this.setSavedQuoteIds(savedQuotesIds)

    this.savedQuotesContainer.querySelector(`[data-id="${quoteId}"]`)?.remove()

    if (!savedQuotesIds.length) {
      this.savedQuotesContainer.innerHTML =
        '<p class="warning">Вы еще не сохранили ни одной цитаты</p>'
    }
  }

  handleDelete(event) {
    const target = event.target
    if (target.matches('[data-delete-saved-quote]')) {
      const quoteId = target.closest('[data-id]').dataset.id
      this.deleteQuote(quoteId)
    }
  }
}

new QuoteApp()
