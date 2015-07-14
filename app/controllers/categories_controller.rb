class CategoriesController < ApplicationController

	def edit
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.find(params[:id])
	end

	def create
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.create(category_params)
		if @category.save
			redirect_to matrix_path(@matrix)
		else
			render 'new' #*** Changs
		end
	end

	def update
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.find(params[:id])
		if @category.update(category_params)
			redirect_to @matrix
		else
			render 'edit'
		end
	end

	def destroy
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.find(params[:id])
		@category.destroy
		redirect_to matrix_path(@matrix)
	end

	private
		def category_params
			params.require(:category).permit(:name, :option)
		end
end
