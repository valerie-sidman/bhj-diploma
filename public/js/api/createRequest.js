/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {

  const xhr = new XMLHttpRequest;
  const formData = new FormData;
  const method = options.method;
  let data = '';

  for (let key in options.data) {
    if (data == '') {
      data = key + '=' + options.data[key];
    } else {
      data = data + '&' + key + '=' + options.data[key];
    }
    formData.append(key, options.data[key]);
  }
  try {

    if (method != 'GET') {
      xhr.open(method, options.url, true);
      for (let key in options.headers) {
        xhr.setRequestHeader(key, options.headers[key]);
      }
      xhr.withCredentials = true;
      xhr.responseType = options.responseType;
      xhr.send(formData);
    } else {
      const url = options.url + '?' + data;
      xhr.open(method, url, true);
      for (let key in options.headers) {
        xhr.setRequestHeader(key, options.headers[key]);
      }
      xhr.withCredentials = true;
      xhr.responseType = options.responseType;
      xhr.send();
    }

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState == xhr.DONE && xhr.status == 200) {
        options.callback(null, xhr.response);
      }
    });

  } catch (e) {
    options.callback(e);
  }

  return xhr;

};
