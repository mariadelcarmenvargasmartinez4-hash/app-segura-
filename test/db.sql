create Table users (
  id serial primary key,
  name varchar(150) not null,
  lastname varchar(250) not null,
);

create Table task (
  id serial primary key,
  name varchar(150) not null,
  description varchar(250) not null,
  priority bool not null,
  user_id integer references users(id)
);

---insertar 2 tareas 