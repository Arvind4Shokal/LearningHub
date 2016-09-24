var courses=[];

/*Api call for getting list*/
function apiCall(){
	$.ajax({
		url:'https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths',
		type:'GET',
		dataType:'json',
		success:function(data){
			console.log("success");
			for (var i = 0; i < data.paths.length; i++) {
				courses.push(data.paths[i]);
			}
			populateList(courses);
		},
		error:function(error){
			console.log(error);
		}
	});
}

//populate list elements
function populateList(allCourses){
	$('#all-items').empty();
	for (var i = 0; i < allCourses.length; i++) {
		addSingleCourse(allCourses[i]);
	}
}

//add each element value to list (assign values to all sub elements)
function addSingleCourse(course){
	var clone=$('#single-item').clone().appendTo('#all-items');
	clone.find(".card-img-top").attr("src",course.image);
	clone.find(".card-title").text(course.name);
	clone.find(".card-block .tags").append(course.tags);
	clone.find(".card-block .desc").text(course.description);
	clone.find(".card-block .duration").append(" "+course.hours+"hrs");
	clone.find(".card-img-overlay span").append(course.learner);
	clone.find(".sign-up-button").attr("href",course.sign_up);
	clone.removeAttr("id");
	clone.attr('id',course.id);
	clone.find(".likes").attr('id','likes-'+course.id);
	clone.find(".likes .like-count").text(localStorage[course.sign_up]);
	clone.find(".dislikes .dislike-count").text(localStorage['d'+course.sign_up]);
	clone.find(".dislikes").attr('id','dislikes-'+course.id);

	//add upvote click event
	$("#likes-" + course.id).click(function(e){
		var clickedId = $(this).attr('id');
   	likeButtonOnClick('.like-count',course.sign_up, clickedId);
   });

	//add down vote click event
   	$("#dislikes-" + course.id).click(function(e){
   		var clickedId = $(this).attr('id');
   	likeButtonOnClick('.dislike-count','d'+course.sign_up, clickedId);
   });
	clone.css('display','inline-block');
}

//function for saving number of likes using local storage 
function likeButtonOnClick(buttStr,key, websiteEl){
	if(typeof(Storage) !== "undefined") {
        if (localStorage[key]) {
            localStorage[key] = Number(localStorage[key])+1;
        } else {
            localStorage[key] = 1;
        }	
        $('#'+websiteEl).find(buttStr).text(localStorage[key]);
    } else {
        console.log("Browser does not support local storage");
        alert("This action is not supported");
    }
}

//search with tag function 
function searchFun(){
	var searchQuery=$("#search-box").val();
	/*call populate list using matched string*/
	populateList(courses.filter(function(course){
		var tag=course.tags;
		return (tag.match(searchQuery)!==null) ;
	}));
}

//Sorting function 
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

$(document).ready(function(){

	apiCall();

	//dynamic search
	$("#search-box").on('input', function(){
		searchFun($(this).val());	
	});

	//radio input 
	$('input[name=optionsRadios]').change(function(){
	var value = $( 'input[name=optionsRadios]:checked' ).val();
	var name;
    if(value=='learners'){
    	courses=courses.sort(function(a, b) {
        var x = a['learner']; var y = b['learner'];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
    	populateList(courses);
    }
    else if(value=='duration'){
    	courses=courses.sort(function(a, b) {
        var x = parseInt(a['hours'].slice(0,-1)); var y = parseInt(b['hours'].slice(0,-1));
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
    	populateList(courses);
    }
    else if(value=='voteup'){
    	courses=courses.sort(function(a, b) {
        var x = localStorage[a.sign_up]; var y = localStorage[b.sign_up];
        if(x==undefined)
        	x=0;
        if(y==undefined)
        	y=0;
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
    	populateList(courses);
    }
    else if(value=='voteup'){
    	courses=courses.sort(function(a, b) {
        var x = localStorage['d'+a['sign_up']]; var y = localStorage['d'+b['sign_up']];
        if(x==undefined)
        	x=0;
        if(y==undefined)
        	y=0;
        console.log(x);
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
    	populateList(courses);
    }
    
	console.log(value);
});
});	