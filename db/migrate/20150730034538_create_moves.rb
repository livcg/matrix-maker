class CreateMoves < ActiveRecord::Migration
  def change
    create_table :moves do |t|
      t.string :cell
      t.integer :symbol
      t.references :matrix, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
