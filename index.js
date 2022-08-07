const books = [
  {
    id: "1",
    title: `Apple. Эволюция компьютера`,
    author: `Владимир Невзоров`,
    img: `https://bukva.ua/img/products/449/449532_200.jpg`,
    plot: `Богато иллюстрированный хронологический справочник по истории компьютеров, в котором увлекательно 
    и в структурированном виде изложена информация о создании и развитии техники Apple на фоне истории 
    персональных компьютеров в целом.
    В книге даны описания десятков наиболее значимых моделей устройств как Apple, так и других производителей, 
    сопровождающиеся большим количеством оригинальных студийных фотографий.
    Книга предназначена для широкого круга читателей, интересующихся историей электроники. 
    Она также может послужить источником вдохновения для дизайнеров, маркетологов и предпринимателей.`,
  },
  {
    id: "2",
    title: `Как объяснить ребенку информатику`,
    author: `Кэрол Вордерман`,
    img: `https://bukva.ua/img/products/480/480030_200.jpg`,
    plot: `Иллюстрированная энциклопедия в формате инфографики о технических, социальных и культурных аспектах 
    в информатике. Пошагово объясняет, как детям максимально эффективно использовать компьютеры и интернет-сервисы, 
    оставаясь в безопасности. 
    Книга рассказывает обо всем: от хранения данных до жизни в интернет-пространстве, 
    от программирования до компьютерных атак. О том, как компьютеры функционируют, о современном программном 
    обеспечении, устройстве Интернета и цифровом этикете. Все концепты - от хакера до биткоина - 
    объясняются наглядно с помощью иллюстраций и схем.`,
  },
  {
    id: "3",
    title: `Путь скрам-мастера. #ScrumMasterWay`,
    author: `Зузана Шохова`,
    img: `https://bukva.ua/img/products/480/480090_200.jpg`,
    plot: `Эта книга поможет вам стать выдающимся скрам-мастером и добиться отличных результатов с вашей командой. 
    Она иллюстрированная и легкая для восприятия - вы сможете прочитать ее за выходные, а пользоваться полученными 
    знаниями будете в течение всей карьеры.
    Основываясь на 15-летнем опыте, Зузана Шохова рассказывает, какие роли и обязанности есть у скрам-мастера, 
    как ему решать повседневные задачи, какие компетенции нужны, чтобы стать выдающимся скрам-мастером, 
    какими инструментами ему нужно пользоваться.`,
  },
];

if (!localStorage.getItem("books")) {
  const booksStr = JSON.stringify(books);
  localStorage.setItem("books", booksStr);
}

const Rootelement = document.querySelector("#root");

const bookList = document.createElement("div");

const bookEl = document.createElement("div");

Rootelement.append(bookList, bookEl);

bookList.classList.add("root-list");
bookEl.classList.add("root-item");

const title = document.createElement("h1");
const titleList = document.createElement("ul");
const btnAdd = document.createElement("button");

bookList.append(title, titleList, btnAdd);

title.classList.add("title");
titleList.classList.add("title-list");
btnAdd.classList.add("title-btn");

title.textContent = "Бібліотека";
btnAdd.textContent = "add";

function readerList() {
  const booksLS = localStorage.getItem("books");
  const books = JSON.parse(booksLS);
  const markCup = books
    .map(({ title, id }) => {
      return `<li id= "${id}"> <p class="title-name">${title}</p> 
    <button type ="button" class = 'btn'>edit</button> <button type ="button" class = 'btn-del'>delete</button> </li> `;
    })
    .join("");

  titleList.insertAdjacentHTML("afterbegin", markCup);

  const titleName = document.querySelectorAll(".title-name");

  titleName.forEach((item) => {
    item.addEventListener("click", renderPreview);
  });
  const editBtnRef = document.querySelectorAll(".btn");
  editBtnRef.forEach((btn) => btn.addEventListener("click", editBook));

  const deleteBtnRef = document.querySelectorAll(".btn-del");
  deleteBtnRef.forEach((btn) => btn.addEventListener("click", deleteBook));
}

readerList();

function renderPreview(event) {
  const booksLS = localStorage.getItem("books");
  const books = JSON.parse(booksLS);

  const book = books.find((item) => item.title === event.target.textContent);
  const markup = createPreviewMarkup(book);
  bookEl.innerHTML = "";
  bookEl.insertAdjacentHTML("afterbegin", markup);
}
function createPreviewMarkup({ title, author, img, plot, id }) {
  return `
  <div id='${id}' class = 'idBook'>
  <h2>${title}</h2>
  <p>${author}</p>
  <img src='${img}' alt=''/>
  <p>${plot}</p>
  </div>
  `;
}

function deleteBook(event) {
  const parseBook = localStorage.getItem("books");
  const arrBooks = JSON.parse(parseBook);
  const bookID = event.target.parentNode.id;
  const bookToDel = arrBooks.filter((book) => book.id !== bookID);
  localStorage.setItem("books", JSON.stringify(bookToDel));
  titleList.innerHTML = "";
  readerList();
  const previewBook = document.querySelector(".idBook");
  if (previewBook && bookID === previewBook.id) {
    bookEl.innerHTML = "";
  }
}

function editBook(event) {
  const parseBook = localStorage.getItem("books");
  const arrBooks = JSON.parse(parseBook);
  const bookIDToFond = event.target.parentNode.id;
  const bookFind = arrBooks.find(
    (item) => item.id === event.target.parentNode.id
  );
  const markup = createFormMarkup(bookFind);
  bookEl.insertAdjacentHTML("afterbegin", markup);
  fillObject(bookFind);
  const saveBtn = document.querySelector(".save");
  saveBtn.addEventListener("click", saveBtnHandler);
  function saveBtnHandler(e) {
    const indexForBook = books.findIndex((book) => book.id === bookIDToFond);
    books[indexForBook] = bookFind;
    localStorage.setItem("books", JSON.stringify(books));
    titleList.innerHTML = "";
    readerList();
    renderNewBookPreview(bookFind);
  }
}

function addBtnHandler() {
  const newBook = {
    id: `Date.now()`,
    title: "",
    author: "",
    img: "",
    plot: "",
  };
  const markup = createFormMarkup(newBook);
  bookEl.insertAdjacentHTML("afterbegin", markup);
  fillObject(newBook);
  const saveBtn = document.querySelector(".save");
  saveBtn.addEventListener("click", saveBtnHandler);
  function saveBtnHandler(e) {
    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));
    titleList.innerHTML = "";
    readerList();
    renderNewBookPreview(newBook);
  }
}

function createFormMarkup(book) {
  return `
  <form >
      <label
      >title
      <input type="text" name = 'title' value='${book.title}'/>
    </label>
    <label
      >author
      <input type="text" name = 'author' value='${book.author}'/>
    </label>
    <label
      >img
      <input type="text" name = 'img' value='${book.img}'/>
    </label>
    <label
      >plot
      <input type="text" name = 'plot' value='${book.plot}'/>
    </label>
    <button type="button" class = 'save'>Save</button>
    </form>`;
}

btnAdd.addEventListener("click", addBtnHandler);

function fillObject(book) {
  const input = document.querySelectorAll("input");
  input.forEach((input) =>
    input.addEventListener("change", inputChangeHandler)
  );
  function inputChangeHandler(e) {
    book[e.target.name] = e.target.value;
  }
}

function renderNewBookPreview(newBook) {
  const booksLS = localStorage.getItem("books");
  const books = JSON.parse(booksLS);

  const book = books.find((item) => item.id === newBook.id);
  const markup = createPreviewMarkup(book);
  bookEl.innerHTML = "";
  bookEl.insertAdjacentHTML("afterbegin", markup);
}
