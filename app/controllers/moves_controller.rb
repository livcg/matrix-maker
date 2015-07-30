class MovesController < ApplicationController
  def create
    @matrix = Matrix.find(params[:matrix_id])
    @move = @matrix.moves.create(move_params)
    redirect_to matrix_path(@matrix)
  end
 
  private
    def move_params
      params.require(:move).permit(:cell, :symbol)
    end
end
