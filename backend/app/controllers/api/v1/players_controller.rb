module Api
  module V1
    class PlayersController < Api::V1::ApplicationController
      protect_from_forgery with: :null_session

      def index
        render :json => Player.all.to_a,
               :serializer => ActiveModel::ArraySerializer,
               :each_serializer => PlayerSerializer
      end

      def show
        render :json => Player.find(params[:id])
      end

      protected

      def default_serializer_options
        super.merge(:serializer => PlayerSerializer)
      end
    end
  end
end
