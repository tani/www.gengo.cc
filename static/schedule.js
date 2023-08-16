const currDate = new Date();
const postDate = new Date(document.querySelector('meta[name="date"]').getAttribute('content'));

if (currDate.getTime() < postDate.getTime()) {
  document.querySelector('main').innerHTML = `
    <p>Sorry, this article is not available yet.</p>
  `;
}
