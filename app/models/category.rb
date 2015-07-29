class Category < ActiveRecord::Base
  belongs_to :matrix
  has_many :options, dependent: :destroy

  validates :name, presence: true,
				 length: { minimum: 1 }
end
