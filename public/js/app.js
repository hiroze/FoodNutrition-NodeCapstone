/* global jQuery, handle, $, api */
'use strict';

const ITEMS_URL = '/v1/items';

const renderPage = function (store) {
  if (store.demo) {
    $('.view').css('background-color', 'gray');
    $('#' + store.view).css('background-color', 'white');
  } else {
    $('.view').hide();
    $('#' + store.view).show();
  }
};

const renderAbout = function() {
  const aboutText =  `		<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
  voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, 
  similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. 
  Et harum quidem rerum facilis est et expedita distinctio. 
  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, 
  omnis voluptas assumenda est, omnis dolor repellendus. 
  Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. 
  Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
<p>Et harum quidem rerum facilis est et expedita distinctio. 
  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, 
  omnis voluptas assumenda est, omnis dolor repellendus. 
  Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. </p>
<p>Founding Contributors:</p>
<ul>
  <li>Kayla R. Webb</li>
  <li>Firoz Kamdar</li>
</ul>`;
  $('#about').find('h2').empty().append(aboutText);
};


const renderResults = function (store) {
  const listItems = store.list.map((item) => {
    console.log(item);
    return `<tr id="${item.id}">
                <td>
                <a href="${item.id}" class="detail">${item.name}</a>
                </td> 
                <td>${item.totalCals}</td>
              </tr>`;
  });
  $('#result').empty().append(renderResultsTable()).find('thead').append(listItems);
};

const renderResultsTable = function() {
  const columns = 
    `<thead>
      <tr>
        <th>Item Name</th>
        <th>Total Calories</th>
    </thead>`;
  $('#result').append(columns);
};

const renderEdit = function (store) {
  const el = $('#edit');
  const item = store.item;
  el.find('[name=name]').val(item.name);
  el.find('[name=servingsize]').val(item.servingSize);
}; 

const editTable = function(store) {
  const item = store.item;
  
  const table = 
  `<table class='tableDetailView' id='${item.id}'>
  <thead>
    <tr>
      <th contenteditable='true'><label for="name">${item.name}</label>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td id='servingSize'><label for="servingsize">
      Serving Size</label></td>
      <td contenteditable='true'>${item.servingSize}</td>
    </tr>
    <tr>
      <td id='fat'><label for="fat">Fat(g):</label></td> 
      <td contenteditable='true'>${item.fat}</td>
    </tr>
     <tr>
      <td id='carbs'><label for="carbs">Carbs(g):</label></td>
      <td contenteditable='true'>${item.carbs}</td> 
      </tr>
      <tr>
        <td id='protein'><label for="protein">Protein(g):</label></td> 
        <td contenteditable='true'>${item.protein}</td>
      </tr>
      <tr>
        <td id='cals'><label for="cals">
        Total Calories:</label></td>
        <td> ${item.totalCals}</td> 
      </tr>
    </tbody>
</table>`;
  $('.nutritionEdit').empty().append(table);
  
};

const renderDetail = function (store) {
  const item = store.item;

  const detailTable = 
    `<table class='tableDetailView'>
        <thead>
          <tr>
            <th><label for="name">${item.name}</label></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id='servingSize'><label for="servingsize">
            Serving Size</label></td>
            <td>${item.servingSize}</td>
          </tr>
          <tr>
            <td id='fat'><label for="fat">Fat(g):</label></td> 
            <td>${item.fat}</td>
          </tr>
           <tr>
            <td id='carbs'><label for="carbs">Carbs(g):</label></td>
            <td>${item.carbs}</td> 
            </tr>
            <tr>
              <td id='protein'><label for="protein">Protein(g):</label></td> 
              <td>${item.protein}</td>
            </tr>
            <tr>
              <td id='cals'><label for="cals">
              Total Calories:</label></td>
              <td> ${item.totalCals}</td> 
            </tr>
          </tbody>
    </table>`;
  $('.nutritionTable').empty().append(detailTable);
};


const handleSearch = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  // const title = el.find('[name=title]').val();
  var query;
  if (name) {
    query = {
      name: el.find('[name=title]').val()
    };
  }
  api.search(query)
    .then(response => {
      store.list = response;
      renderResults(store);

      store.view = 'search';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleCreate = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const document = {
    title: el.find('[name=title]').val(),
    content: el.find('[name=content]').val()
  };
  api.create(document)
    .then(response => {
      store.item = response;
      store.list = null; //invalidate cached list results
      renderDetail(store);
      store.view = 'detail';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

// const handleUpdate = function (event) {
//   event.preventDefault();
//   const store = event.data;
//   const el = $(event.target);

//   const document = {
//     id: store.item.id,
//     title: el.find('[name=title]').val(),
//     content: el.find('[name=content]').val()
//   };
//   api.update(document, store.token)
//     .then(response => {
//       store.item = response;
//       store.list = null; //invalidate cached list results
//       renderDetail(store);
//       store.view = 'detail';
//       renderPage(store);
//     }).catch(err => {
//       console.error(err);
//     });
// };

const handleUpdate = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const document = {
    id: store.item.id,
    name: el.find('label[for=name]').find('td').val(),
    servingSize: el.find('label[for=servingSize]').find('td').val(),
    fat: el.find('label[for=fat]').val(),
    carbs: el.find('label[for=carbs]').find('td').val(),
    protein: el.find('label[for=protein]').val()
    // content: el.find('[name=content]').val()
  };
  api.update(document, store.token)
    .then(response => {
      store.item = response;
      store.list = null; //invalidate cached list results
      renderDetail(store);
      store.view = 'detail';
      renderPage(store);
    }).catch(err => {
      console.error(err);
    });
};

const handleDetails = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const id = el.closest('tr').attr('id');

  api.details(id)
    .then(response => {
      store.item = response;
      renderDetail(store);

      store.view = 'detail';
      renderPage(store);

    }).catch(err => {
      store.error = err;
    });
};

const handleRemove = function (event) {
  event.preventDefault();
  const store = event.data;
  const id = store.item.id;

  api.remove(id, store.token)
    .then(() => {
      store.list = null; //invalidate cached list results
      return handleSearch(event);
    }).catch(err => {
      console.error(err);
    });
};

const handleViewAbout = function(event) {
  event.preventDefault();
  const store = event.data;
  store.view = 'about';
  renderAbout();
  renderPage(store);
};

const handleViewCreate = function (event) {
  event.preventDefault();
  const store = event.data;
  store.view = 'create';
  renderPage(store);
};
const handleViewList = function (event) {
  event.preventDefault();
  const store = event.data;
  if (!store.list) {
    handleSearch(event);
    return;
  }
  store.view = 'search';
  renderPage(store);
};
const handleViewEdit = function (event) {
  event.preventDefault();
  const store = event.data;
  renderEdit(store);
  editTable(store);

  store.view = 'edit';
  renderPage(store);
};

//on document ready bind events
jQuery(function ($) {

  const STORE = {
    demo: false,        // display in demo mode true | false
    view: 'list',       // current view: list | details | create | edit 
    query: {},          // search query values
    list: null,         // search result - array of objects (documents)
    item: null,         // currently selected document
  };

  $('#create').on('submit', STORE, handleCreate);
  $('#about').on('submit', STORE, handleViewAbout);
  $('#search').on('submit', STORE, handleSearch);
  $('#edit').on('submit', STORE, handleUpdate);

  $('#result').on('click', '.detail', STORE, handleDetails);
  $('#detail').on('click', '.remove', STORE, handleRemove);
  $('#detail').on('click', '.edit', STORE, handleViewEdit);

  $(document).on('click', '.viewCreate', STORE, handleViewCreate);
  $(document).on('click', 'viewAbout', STORE, handleViewAbout);
  $(document).on('click', '.viewList', STORE, handleViewList);

  // start app by triggering a search
  $('#search').trigger('submit');

});
