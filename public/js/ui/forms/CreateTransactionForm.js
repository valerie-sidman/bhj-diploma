/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const userCurrent = User.current();
    Account.list(userCurrent, (err, response) => {
      response.data.forEach((item) => {
        const expenseAccountsList = document.querySelector('#expense-accounts-list');
        const incomeAccountsList = document.querySelector('#income-accounts-list');
        const accountListHtml = `<option value="${item.id}">${item.name}</option>`;
        if (!expenseAccountsList.querySelector(`[value="${item.id}"]`)) {
          expenseAccountsList.insertAdjacentHTML('beforeEnd', accountListHtml);
        }
        if (!incomeAccountsList.querySelector(`[value="${item.id}"]`)) {
          incomeAccountsList.insertAdjacentHTML('beforeEnd', accountListHtml);
        }
      });
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( options ) {
    Transaction.create(options, (err, response) => {
      if (response.success) {
        this.element.reset();
        if (this.element.id == 'new-income-form') {
          App.getModal('newIncome').close();
        } else if (this.element.id == 'new-expense-form') {
          App.getModal('newExpense').close();
        }
        App.update();
      }
    });
  }
}
