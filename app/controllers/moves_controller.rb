class MovesController < ApplicationController
  def index
    @matrix = Matrix.find(params[:matrix_id])
    @moves = @matrix.moves.sort_by{ |move| move.created_at }
    	.collect { |move| [ move.id, move.cell, move.symbol ]}
    render json: @moves
  end	
 
  def create
    @matrix = Matrix.find(params[:matrix_id])
    @move = @matrix.moves.create(move_params)
    redirect_to matrix_path(@matrix)
  end

  def destroy
	@matrix = Matrix.find(params[:matrix_id])
    @move = @matrix.moves.find(params[:id])
    @move.destroy
	redirect_to matrix_path(@matrix)
  end

  private
    def move_params
      params.require(:move).permit(:cell, :symbol)
    end
end
