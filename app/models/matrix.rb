class Matrix < ActiveRecord::Base
	has_many :categories, dependent: :destroy
	has_many :moves, dependent: :destroy

	validates :name, presence: true
end
