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
  //removed the .empty() that was immediately after result
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
  el.find('[name=title]').val(item.title);
  el.find('[name=content]').val(item.content);
}; 

// const renderDetailTable = function(store) {
//   const item = store.item;
//   const column = `
//   <thead>
//     <tr>
//       <th>${item.name}</th>
//     </tr>
//   </thead>
//   `;
//   $('#details').append(column);
// };

// const renderDetail = function (store) {
//   const el = $('#detail');
//   const item = store.item;
//   renderDetailTable();
//   el.find('.name').text(item.name);
//   el.find('.serve-size').text(item.servingSize);
//   el.find('.fat').text(item.fat);
//   el.find('.carbs').text(item.carbs);
//   el.find('.protein').text(item.protein);
//   el.find('.cal-count').text(item.totalCalories);
// };

// const createTable = function() {

// }
// not using
//   const columns = 
//   `<thead>
//     <tr>
//       <th>Item Name</th>
//     </tr>
//   `;
//   $('legend').append(columns);
// };

const renderCreate = function (store) {
  const el = $('#create');
  const item = store.item;
  const createTable = `			
<div class='container'>
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" placeholder=" e.g. Granny Smith Apple" required>
    </div>
    <div>
      <label class="serv-size" for="servingSize">Serving Size</label>
      <input type="text" name="servingSize" required>
    </div>
    <div>
      <label for="fat">Fat (g)</label>
      <input type="text" name="fat" required>
    </div>
    <div>
      <label for="carbs">Carbs (g)</label>
      <input type="text" name="carbs" required>
    </div>
    <div>
      <label for="protein">Protein (g)</label>
      <input type="text" name="protein" required>
    </div>

      <button type="submit">Submit</button>
</div>  
      `;

$('#create').empty().append(createTable);

};
 


const renderDetail = function (store) {
  const el = $('#detail');
  const item = store.item;
  const detailTable = `<table class='tableDetailView'>
  <thead>
  <tr>
  <th>${item.name}</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>Serving Size</td>
  <td>${item.servingSize}</td>
  </tr>
  <tr>
  <td>Fat(g):</td> 
  <td>${item.fat}</td>
  </tr>
  <tr>
  <td>Carbs(g):</td>
  <td>${item.carbs}</td> 
  </tr>
  <tr>
  <td>Protein(g):</td> 
  <td>${item.protein}</td>
  </tr>
  <tr>
  <td>Total Calories:</td>
  <td> ${item.totalCals}</td> 
  </tr>
  </tbody>
</table>`;
$('.nutritionTable').empty().append(detailTable);
};

  // el.append(renderDetailTable(store)).find('thead').append(details);
  //not using
//   renderDetailTable();
//   el.find('.name').text(item.name);
//   el.find('.serve-size').text(item.servingSize);
//   el.find('.fat').text(item.fat);
//   el.find('.carbs').text(item.carbs);
//   el.find('.protein').text(item.protein);
//   el.find('.cal-count').text(item.totalCalories);
// };
  // el.find('.name').text(item.name);
  // el.find('.serve-size').text(item.servingSize);
  // el.find('.fat').text(item.fat);
  // el.find('.carbs').text(item.carbs);
  // el.find('.protein').text(item.protein);
  // el.find('.cal-count').text(item.totalCalories);
// };

const handleSearch = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);
  const title = el.find('[name=title]').val();
  var query;
  if (title) {
    query = {
      title: el.find('[name=title]').val()
    };
  }
  api.search(query)
    .then(response => {
      store.list = response;
      // renderTable(store);
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
    name: el.find('[name=name]').val(), //name is name of input
    servingSize: el.find('[name=servingSize]').val(),
    fat: el.find('[name=fat]').val(),
    carbs: el.find('[name=carbs]').val(),
    protein: el.find('[name=protein]').val()    
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

const handleUpdate = function (event) {
  event.preventDefault();
  const store = event.data;
  const el = $(event.target);

  const document = {
    id: store.item.id,
    title: el.find('[name=title]').val(),
    content: el.find('[name=content]').val()
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
  // was li and changed to tr
  const id = el.closest('tr').attr('id');
  api.details(id)
    .then(response => {
      store.item = response;
      renderDetail(store);
      // renderDetailTable(store);

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
const handleViewCreate = function (event) {
  event.preventDefault();
  const store = event.data;
  renderCreate(store);
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
  $('#search').on('submit', STORE, handleSearch);
  $('#edit').on('submit', STORE, handleUpdate);

  $('#result').on('click', '.detail', STORE, handleDetails);
  $('#detail').on('click', '.remove', STORE, handleRemove);
  $('#detail').on('click', '.edit', STORE, handleViewEdit);

  $(document).on('click', '.viewCreate', STORE, handleViewCreate);
  $(document).on('click', '.viewList', STORE, handleViewList);

  // start app by triggering a search
  $('#search').trigger('submit');

});
