function getPokemon(clickedItem) {
    return fetch("https://pokeapi.co/api/v2/pokemon/" + clickedItem + "/", {mode: "cors"})
                .then(response => response.json())
                .catch(err => {
                    console.log("ERROR fetch ");
                });
}

function getEvolution(clickedItem) {
    return fetch("https://pokeapi.co/api/v2/pokemon-species/" + clickedItem + "/", {mode: "cors"})
                .then(response => response.json() )
                .catch(err => {
                    console.log("ERROR fetch ");
                });
}

function getAllParameters(clickedItem) {
    return Promise.all([getPokemon(clickedItem), getEvolution(clickedItem)])
}

function fillPokemonTable(pokemonAmount) {

    //Showing pokemon information preloaded
    for(var i =1; i <= pokemonAmount; ++i) {
        row = "<tr>"
        row += "<td class=\"select\"> <img id=\"" + i +  "\"src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + i + ".png\">"
        row += "<p id=\"pokemonName\">"+ monsterSummaries.monsters[i-1].name+"</p> </td>"
        row += "</tr>"

        $("#pokemonTable tbody").append(row);
    }

    tableReference = $("#pokemonTable").DataTable({
        "bDestroy" : true,
        "columnDefs": [{ "orderable": false, "targets": 0 }],
        "ordering": false,
        "aLengthMenu": [[5,10, -1], [5,10, "All"]]
    } );

    $("#pokemonTable tbody").on( "click", "tr", function () {

        if ( $(this).hasClass("selected") ) {
            $(this).removeClass("selected");
        }
        else {
            tableReference.$("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            clickedItem = parseInt(tableReference.row(this).index() + 1);

            $("#modal-title").html("Performing the API query");
            $("#modal-body").html("<img id=\"loading\" src=\"./static/img/loading.gif\" alt=\"loading\">");
            $("#myModal").modal();

            getAllParameters(clickedItem).then(([pokemon, evolution]) => {
                $("#modal-title").html(pokemon.name.toUpperCase());
                bodyText =  "<img id=\"" + i +  "\"src=\"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + clickedItem + ".png\">";
                bodyText += "<p class=\"texto\"> <b>NUMBER:</b> " + clickedItem + "<br>"
                bodyText += "<b>NAME: </b>" + pokemon.name.toUpperCase() + "<br>"

                types = ""
                pokemon.types.forEach(element => {
                    types += element.type.name + ", ";
                });
                types = types.substr(0, types.length - 2);

                bodyText += "<b>TYPE: </b>" + types + "<br>"
                if(evolution.evolves_from_species == null) {
                    message = "Base one";
                }
                else{
                    message = "Evolution from another";
                }

                bodyText += "<b>EVOLUTION INFORMATION: </b>" + message + "<br>"

                $("#modal-body").html(bodyText);
                $("#myModal").modal();
            })
        }
    } );
}

fillPokemonTable(35);
