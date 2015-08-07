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
    render json: @move.id
  end

  def destroy
	@matrix = Matrix.find(params[:matrix_id])
    @move = @matrix.moves.find(params[:id])
    @move.destroy
	redirect_to matrix_path(@matrix)
  end

  def createnote
    params.require(:id) #*** Why not :matrix_id?
    params.permit(:movenote) #*** Why not in params[:id] hash?
    matrix = Matrix.find(params[:id])
    move_note_params = [ cell: "0", symbol: params[:movenote] ]
    move = matrix.moves.create(move_note_params)
    render json: move[0].id #*** Why is move an array?
  end

  private
    def move_params
      params.require(:move).permit(:cell, :symbol)
    end
end
