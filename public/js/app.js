$(".scrape").on("click", event => {
  $.post("/delScrape", data => { })
    .then($.get("/scrape", data => { })
      .then(function () {
        $("#scrape").attr("href", "/articles")
        $(".scrape").html("View Articles");
      })
    )
})


$(".title").on("click", function (event) {

  $("#notes").empty();

  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function (data) {
    $("#notes").append("<h2>" + data.title + "</h2>");
    $("#notes").append("<input id='titleinput' name='title' >");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append("<button data-id='" + data._id + "' id='saveNote'>Save Note</button>");
    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
})

$(document).on("click", "#saveNote", function () {
  let thisId = $(this).attr("data-id");


  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function (data) {
    console.log(data)
    $("#notes").empty();
  })
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

