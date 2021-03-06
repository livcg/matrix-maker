class MatricesController < ApplicationController

	def index
		@matrices = Matrix.all.sort_by { |m| m.created_at }
	end

	def show
		@matrix = Matrix.find(params[:id])
	end

	def new
		@matrix = Matrix.new
	end

	def edit
		@matrix = Matrix.find(params[:id])
	end

	def create
		@matrix = Matrix.new(matrix_params)

		if @matrix.save
			redirect_to @matrix
		else
			render 'new'
		end
	end

	def update
		@matrix = Matrix.find(params[:id])
		if @matrix.update(matrix_params)
			render 'show'
		else
			render 'edit'
		end
	end

	def destroy
		@matrix = Matrix.find(params[:id])
		@matrix.destroy
		redirect_to matrices_path
	end

	def undomoves
		@matrix = Matrix.find(params[:id])
		lastMove = @matrix.moves.find(params[:move_id])
		@matrix.moves.map() { |move|
			if (move.id >= lastMove.id)
				move.destroy
			end
		}
		redirect_to matrix_path
	end

	private
		def matrix_params
			params.require(:matrix).permit(:name, :category)
		end
end
