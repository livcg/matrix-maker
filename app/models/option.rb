class Option < ActiveRecord::Base
  belongs_to :category

  validates :name, presence: true,
				 length: { minimum: 1 }
end
