class OptionsController < ApplicationController
	def show
		@category = Category.find(params[:category_id])
		@option = @category.options.create(option_params)
	end

	def edit
		@category = Category.find(params[:category_id])
		@option = @category.options.create(option_params)
	end

	def create
		@category = Category.find(params[:category_id])
		@option = @category.options.create(option_params)
		if @option.save
			redirect_to matrix_category_path({id: params[:category_id]}) #*** ?
		else
			render 'show' #*** Change
		end
	end

	private
		def option_params
			params.require(:option).permit(:name)
		end
end
