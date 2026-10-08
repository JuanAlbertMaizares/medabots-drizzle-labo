CREATE TABLE "medabots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"medaforce" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"head" varchar(100) NOT NULL,
	"left_arm" varchar(100) NOT NULL,
	"right_arm" varchar(100) NOT NULL
);
