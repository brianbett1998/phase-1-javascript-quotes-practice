const quoteList = document.getElementById('quote-list');

function renderQuote(quote) {
  const li = document.createElement('li');
  li.classList.add('quote-card');
  li.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  `;
  
  const deleteBtn = li.querySelector('.btn-danger');
  deleteBtn.addEventListener('click', () => {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        li.remove();
      });
  });
  
  const likeBtn = li.querySelector('.btn-success');
  likeBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteId: quote.id,
        createdAt: new Date().getTime(),
      }),
    })
      .then(() => {
        const likeCount = li.querySelector('span');
        likeCount.textContent = quote.likes.length + 1;
      });
  });
  
  quoteList.appendChild(li);
}

fetch('http://localhost:3000/quotes?_embed=likes')
  .then(response => response.json())
  .then(quotes => {
    quotes.forEach(renderQuote);
  });

const quoteForm = document.getElementById('new-quote-form');
quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const quoteInput = document.getElementById('new-quote');
  const authorInput = document.getElementById('author');
  
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quote: quoteInput.value,
      author: authorInput.value,
    }),
  })
    .then(response => response.json())
    .then(renderQuote);
  
  quoteInput.value = '';
  authorInput.value = '';
});
