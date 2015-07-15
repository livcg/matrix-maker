# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

matrices = Matrix.create([{ name: 'Names Pets Cars' },
                          { name: 'Who''s on first?' },
                          { name: 'Puzzle A' }])

categories = Category.create([{ name: 'First Name', matrix_id: 1 },
                              { name: 'Last Name', matrix_id: 1 },
                              { name: 'City', matrix_id: 1 },
                              { name: 'Pet', matrix_id: 1 },
                              { name: 'Car', matrix_id: 1 },
                              { name: 'First', matrix_id: 2 },
                              { name: 'Last', matrix_id: 2 },
                              { name: 'Position', matrix_id: 2 },
                              { name: 'Team', matrix_id: 2 }])

options = Option.create([{ name: 'Ann', category_id: 1 },
                         { name: 'Bob', category_id: 1 },
                         { name: 'Carol', category_id: 1 },
                         { name: 'Jones', category_id: 2 },
                         { name: 'Lee', category_id: 2 },
                         { name: 'Smith', category_id: 2 },
                         { name: 'BOS', category_id: 3 },
                         { name: 'MEL', category_id: 3 },
                         { name: 'WLG', category_id: 3 },
                         { name: 'capybara', category_id: 4 },
                         { name: 'ibis', category_id: 4 },
                         { name: 'quokka', category_id: 4 },
                         { name: 'Civic', category_id: 5 },
                         { name: 'Mini', category_id: 5 },
                         { name: 'Smart', category_id: 5 }])
