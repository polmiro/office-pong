module Api
  module V1
    class GamesController < Api::V1::ApplicationController
      def index
        render :json => Game.all.to_a,
               :serializer => ActiveModel::ArraySerializer,
               :each_serializer => GameSerializer
      end

      def show
        render :json => Game.find(params[:id]),
               :serializer => GameSerializer
      end

      def create
        render :status => 201,
               :json => ReportGame.run!(:report => game_params),
               :serializer => GameSerializer
      end

      private

      def game_params
        params.require(:game).permit!
      end
    end
  end
end
