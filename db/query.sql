-- View employee

-- A = department
-- B = role
-- C = employee

SELECT A.id as ID, C.first_name, C.last_name, B.title, A.name as Department, B.salary, CONCAT(C.first_name, " ", C.last_name) as Manager
FROM department as A
INNER JOIN role as B
ON A.id = B.department_id 
INNER JOIN employee as C
ON B.id = C.role_id




