
projects = [];
currentProject = {};
currentProject_interface = {};

currentActive = null;

editor = null;
editor2 = null;

currentinterface = null;

function Projec(){ 
	var name;
} 


function Item(){ 
	var interfaceName;
	var json;
} 

function clickLeftNavi(obj){
	var name = obj.text;
	currentProject.name = name;
	li = obj.parentNode;
	$(li).attr("class", "active");
	if(currentActive != null)
		currentActive.attr("class", "");
	currentActive = $(li);

	items_str = localStorage.getItem(name);
	currentProject_interface = JSON.parse(items_str);

	$('#add_interface_btn').attr("disabled", false);
	$('#success_btn').attr("disabled", false);

	$('#interface_table').empty();

	count = 0;
	if(currentProject_interface != null)
		count = currentProject_interface['count'];
	for(i = 0; i < count; i++){
		item = currentProject_interface[i.toString()];
		generateInterface(i, item);
	}

	$('#projectname').text('Project ' + name);
}

function addLeftNavi(name){
	var item = '<li><a href="#" onclick="clickLeftNavi(this)">' + name + '</a></li>';
	$('#left_navi').append(item);
	currentProject['name'] = name;
	currentProject['count'] = 0;
}

function generateInterface(id, item){
	var row = '<tr id="interfacerow' + id + '">' + 
                  '<td>' + id + '</td>' + 
                  '<td><span class="label label-success">' + item.interfaceName + '</span></td>' + 
                  '<td><button type="button" class="btn btn-default btn-sm" id="popover' + id + '" data-toggle="popover" title="Json Respose" data-content=\'' + item.json + '\'>JSON</button></td>' +
                  '<td><button type="button" class="btn btn-warning btn-sm" id="modify' + id + '" onclick="fillJson(this)">修改</button>' +
                  '<button type="button" style="margin-left:5px" class="btn btn-danger btn-sm" id="interface' + id + '" onclick="deleteInterface(this)">删除</button></td>' +
                '</tr>';

    $('#interface_table').append(row);
    $('[data-toggle="popover"]').popover();
}

function createProject(){
	var name = $('#add_project_name').val();
	$('#add_project_name').val('');

	var project = {};

	project.name = name;

	if(projects == null){
		projects = new Array();
	}
	projects.push(project);

	localStorage.setItem("projects", JSON.stringify(projects));

	addLeftNavi(name);
	
	$('#addProject').modal('toggle');
}

function removeProject(){
	if(currentProject == null){
		return;
	}
	localStorage.removeItem(currentProject.name);

	for(var i in projects){
		if(currentProject.name == projects[i].name){
			projects = projects.splice(i, i);
		}
	}
	localStorage.setItem("projects", JSON.stringify(projects));
	location.reload();
}

function addInterface(){
	var json = editor2.get();
	var item = new Item();

	item.interfaceName = $('#add_interface_name').val();
	item.json = JSON.stringify(json);

	if(currentProject_interface == null){
		currentProject_interface = {};
		currentProject_interface['count'] = 0;
	}

	generateInterface(currentProject_interface.count, item);

	currentProject_interface[currentProject_interface['count'].toString()] = item;
	currentProject_interface['count'] = currentProject_interface['count'] + 1;

	localStorage.setItem(currentProject.name, JSON.stringify(currentProject_interface));

	$('#addInterface').modal('toggle');

	var json = editor2.set({});
	$('#add_interface_name').val('');

}

function fillJson(obj){
	var id = obj.id;
	var num_str = id.substring(6);

	currentinterface = num_str;

	var item = currentProject_interface[num_str];

	editor.set(JSON.parse(item.json));

	$('#myModal').modal('toggle');
}

function modifyJson(){
	var json = editor.get();

	var item = currentProject_interface[currentinterface];
	item.json = JSON.stringify(json);
	localStorage.setItem(currentProject.name, JSON.stringify(currentProject_interface));
	$('#popover' + currentinterface).attr('data-content', item.json);
	$('#myModal').modal('toggle');
}

function deleteInterface(obj){
	var id = obj.id;
	var num_str = id.substring(9);
	var rowid = 'interfacerow' + num_str;
	
	parseInt(num_str);

	currentProject_interface['count'] = currentProject_interface['count'] - 1;

	delete currentProject_interface[num_str];
	localStorage.setItem(currentProject.name, JSON.stringify(currentProject_interface));

	var tr = obj.parentNode.parentNode;
	$(tr).remove();
}

function successSave(){

	$.ajax({ 
		type: "post", 
		url: "/register/interface", 
		dataType: "json",
		data: currentProject_interface,
		success: function (data) { 
			alert("success");
		}, 
		error: function (XMLHttpRequest, textStatus, errorThrown) { 
			alert(errorThrown); 
		} 
	});
}

$(function () {
  $('[data-toggle="popover"]').popover();

	var container = document.getElementById("jsoneditor");
	var options = {mode: 'code'};
	editor = new JSONEditor(container, options);

	var container2 = document.getElementById("jsoneditor2");
	var options2 = {mode: 'code'};
	editor2 = new JSONEditor(container2, options);
	// get json
	//var json = editor.get();

	projects_str = localStorage.getItem("projects");
	projects = JSON.parse(projects_str);

	for(var i in projects){
		addLeftNavi(projects[i].name);
	}
	
})


