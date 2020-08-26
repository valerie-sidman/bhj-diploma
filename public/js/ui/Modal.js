/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (this.element === null) {
      throw new Error('Не был передан аргумент');
    }
    this.element = element;
    this.closeModal = (event) => {
      this.onClose();
      event.preventDefault();
    }
    this.registerEvents();
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    Array.from(this.element.querySelectorAll('[data-dismiss="modal"]')).forEach(item => {
      item.addEventListener('click', this.closeModal)
    });
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose( e ) {
    this.close();
  }
  /**
   * Удаляет обработчики событий
   * */
  unregisterEvents() {
    Array.from(this.element.querySelectorAll('[data-dismiss="modal"]')).forEach(item => {
      item.removeEventListener('click', this.closeModal)
    });
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.style.display = "block";
  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close(){
    this.element.style.display = "none";
  }
}
