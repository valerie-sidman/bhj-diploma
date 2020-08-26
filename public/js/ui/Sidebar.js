/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarMini = document.querySelector('.sidebar-mini');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    sidebarToggle.addEventListener('click', (e) => {
      if (sidebarMini.classList.contains('sidebar-open') && sidebarMini.classList.contains('sidebar-collapse')) {
        sidebarMini.classList.remove('sidebar-open');
        sidebarMini.classList.remove('sidebar-collapse');
      } else {
        sidebarMini.classList.add('sidebar-open');
        sidebarMini.classList.add('sidebar-collapse');
      }
      e.preventDefault();
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    Array.from(document.querySelectorAll('.menu-item')).forEach(menuItem => {
      menuItem.addEventListener('click', (e) => {
        if (menuItem.classList.contains('menu-item_register')) {
          App.getModal('register').open();
        } else if (menuItem.classList.contains('menu-item_login')) {
          App.getModal('login').open();
        } else {
          User.logout(User.current, (err, response) => {
            if (response.success) {
              App.setState('init');
            }
          });
        }
        e.preventDefault();
      });
    });
  }

}
