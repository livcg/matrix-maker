class AddSymbolFromMoves < ActiveRecord::Migration
  def change
    add_column :moves, :symbol, :string
  end
end
