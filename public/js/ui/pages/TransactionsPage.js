/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (this.element === null) {
      throw new Error('Не был передан аргумент');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = document.querySelector('.remove-account');
    removeAccount.addEventListener('click', (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    const transactionRemove = document.querySelectorAll('.transaction__remove');
    Array.from(transactionRemove).forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const transactionId = item.getAttribute('data-id');
        this.removeTransaction(transactionId);
      });
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove(this.lastOptions.account_id, this.lastOptions, (err, response) => {
          if (response.success) {
            App.update();
          }
        });
        this.clear();
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, {}, (err, response) => {
        if (response.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ) {
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, options, (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
        }
      });
      Transaction.list(options, (err, response) => {
        if (response.success) {
          this.renderTransactions(response.data);
          this.registerEvents();
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = undefined;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle( name ) {
    const contentTitle = document.querySelector('.content-title');
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
    const dateTransaction = new Date(date);
    let optionsDate = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    let optionsTime = {
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric'
    };
    return dateTransaction.toLocaleString('ru', optionsDate) + ' в ' + dateTransaction.toLocaleString('ru', optionsTime);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML( item ) {
    return `
    <div class="transaction ${item.type == 'expense' ? 'transaction_expense' : 'transaction_income'} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>
        </button>
    </div>
</div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions( data ) {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    Array.from(data).forEach(item => {
      content.insertAdjacentHTML('beforeEnd', this.getTransactionHTML(item));
    });
  }
}
