const axios = require("axios");

/*
  question schema:{
    question:string,
    A:string,
    B:string,
    C:string,
    D:string,
    answer:string(A,B,C,D)
  }
*/
async function checkDb() {
  const url = `https://opentdb.com/api.php?amount=1&category=15`;
  let response = await axios.get(url);
  let response_code = response.data.response_code;
  return response_code == 0;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
async function getQuestions({ amount = 15, category = "", difficulty = "" }) {
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986`;
  let response = await axios.get(url);
  response = response.data.results;
  let results = [];
  for (let q of response) {
    let x = [q.correct_answer, ...q.incorrect_answers];
    shuffle(x);
    let answer = String.fromCharCode(65 + x.indexOf(q.correct_answer));
    let newQ = {
      question: decodeURIComponent(q.question),
      A: decodeURIComponent(x[0]),
      B: decodeURIComponent(x[1]),
      C: decodeURIComponent(x[2]),
      D: decodeURIComponent(x[3]),
      answer
    };
    results.push(newQ);
  }
  return results;
}
async function getCategoryDetail() {
  let category = await getCategory();
  let promises = [];
  for (let x of category)
    promises.push(
      axios.get(`https://opentdb.com/api_count.php?category=${x.id}`)
    );
  let response = await Promise.all(promises);
  let datas = response.map(e => e.data);
  for (let i = 0; i < category.length; i++)
    category[i].category_question_count = datas[i].category_question_count;
  return category;
}

async function getCategory() {
  let url = "https://opentdb.com/api_category.php";
  let response = await axios.get(url);
  response = response.data.trivia_categories;
  return response;
}

async function getCategoryName(id) {
  let c = await getCategory();
  let res = c.find(e => e.id == id);
  if (!res) return "ALL";
  return res.name;
}

module.exports = {
  getCategoryName,
  getQuestions,
  checkDb,
  getCategoryDetail,
  getCategory
};
