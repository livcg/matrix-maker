class RemoveSymbolFromMoves < ActiveRecord::Migration
  def change
    remove_column :moves, :symbol, :integer
  end
end
