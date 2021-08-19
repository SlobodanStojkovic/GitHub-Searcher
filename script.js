var $search = $("#search");
var $gallery = $(".gallery");
var $logo = $(".logo");
var $newPageH1 = $(".newPageH1");

var $person;

function getUserDetails() {

    function getUserOnClick() {
        $person = $(this).text();
        localStorage.setItem("1", $person);
    }

    $(".userLink").click(getUserOnClick);

    $("img").click(getUserOnClick);

    $(".userLink").click(newPage);
}

$search.keypress(function (event) {

    if (event.which == 13) {
        $gallery.empty();   //empty gallery if it has previous searches
        
        var searchUsersRequest = new XMLHttpRequest();
        var $person = $search.val();
        var searchUsersEndpoint = "https://api.github.com/search/users?q=" + $person;

        $newPageH1.attr("hidden", true);
        $(".dataTable").remove();

        searchUsersRequest.open("GET", searchUsersEndpoint);

        searchUsersRequest.onload = function () {
            if (searchUsersRequest.status >= 200 && searchUsersRequest.status < 300) {

                var searchUsersResponse = JSON.parse(searchUsersRequest.responseText);

                var searchedUsers = searchUsersResponse.items;

                for (var i = 0; i < searchedUsers.length; i++) {

                    var userDiv = document.createElement("div");
                    userDiv.setAttribute("class", "users");
                    $gallery.append(userDiv);

                    var userImg = searchedUsers[i].avatar_url;
                    var username = searchedUsers[i].login;

                    var $div = $("<div>");
                    $div.addClass("userLink");
                    var $p = $("<p>");
                    $p.text(username);
                    $p.appendTo($div);

                    var $img = document.createElement("img");
                    $img.setAttribute("src", userImg);
                    $div.prepend($img);

                    userDiv.append($div[0]);

                    $search.val("");    //this will after we click for search clear input field
                }
            }
        };
        searchUsersRequest.send();
        setTimeout(getUserDetails, 300);
    }
});



function backToHomePage() {
    window.location.href = "index.html";
}

$logo.click(backToHomePage);



function newPage() {

    $person = localStorage.getItem("1", $person);
    $("#userName").text($person);

    var selectedUserRequest = new XMLHttpRequest();

    var selectedUserEndpoint = "https://api.github.com/users/" + $person + "/repos?page=1&per_page=100";
    console.log(selectedUserEndpoint);

    selectedUserRequest.open("GET", selectedUserEndpoint);

    $newPageH1.attr("hidden", null);

    selectedUserRequest.onload = function () {
        if (selectedUserRequest.status >= 200 && selectedUserRequest.status < 300) {

            $gallery.empty();

            var selectedUserResponse = JSON.parse(selectedUserRequest.responseText);
            console.log(selectedUserResponse);

            var table = $("<table>");
            table.attr("class", "dataTable");

            var tr = $("<tr>");
            var th1 = $("<th>");
            var th2 = $("<th>");
            var th3 = $("<th>");
            th1.text("Repository name");
            th2.text("Description");
            th3.text("Language");

            th1.appendTo(tr);
            th2.appendTo(tr);
            th3.appendTo(tr);
            tr.appendTo(table);
            $(".newPageH1").after(table);

            for (var i = 0; i < selectedUserResponse.length; i++) {

                var repName = selectedUserResponse[i].name;
                var description = selectedUserResponse[i].description;
                var language = selectedUserResponse[i].language;

                var $tr = $("<tr>");
                var $td1 = $("<td>");
                var $td2 = $("<td>");
                var $td3 = $("<td>");

                $td1.text(repName);
                $td1.appendTo($tr);
                $td2.text(description);
                $td2.appendTo($tr);
                $td3.text(language);
                $td3.appendTo($tr);
                $tr.appendTo($(".dataTable"));
            }
        }
    };
    selectedUserRequest.send();
}