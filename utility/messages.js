
let messages = {}



// user module
messages.email_already_exist = "This email already exists.!!"
messages.user_registered_successfully = "User has been registered successfully"
messages.provide_email = "Please provide email."
messages.provide_password = "Please provide password."
messages.invalid_email = "Invalid User, Please enter valid user email!"
messages.invalid_password = "Invalid password , Please enter valid user password!"
messages.user_login_successfully = "User LogIn successfully!!"
messages.user_not_found_with_provided_id = "No user found with that id!"
messages.user_get_successfully = "Get current user profile successfully!!"
messages.user_not_found_with_provided_id = "No user found with that id!"
messages.user_update_successfully = "User profile updated successfully!!"
messages.enter_valid_value_of_user = "please enter valid value of user"

// task module
messages.task_already_addded_by_user= "This Task is already added by this user successfully"
messages.task_created_successfully = "Task has been created successfully"
messages.task_updated_successfully = "Task has been updated successfully"
messages.task_deleted_successfully = "Task has been deleted successfully"
messages.task_get_successfully = "Task information retriving successfully"
messages.task_not_found_with_provided_id = "task is not found with provided task_id "
messages.enter_valid_value_of_task = "please enter valid value of task"
messages.enter_valid_value_of_task_completed_flag = "please enter valid value of task completed_flag :- true or false"
messages.user_can_not_access_other_user_tasks = "User can not access other user tasks."

//pagination 
messages.enter_valid_value_for_pagination = "Please Enter valid(Greater then Zero) value for the page and limit query parameter."

module.exports.messages = messages