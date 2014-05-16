module Api
  module V1
    class PlayersController < Api::V1::ApplicationController
      def index
        render :json => Player.all.to_a,
               :serializer => ActiveModel::ArraySerializer,
               :each_serializer => PlayerSerializer
      end

      def show
        render :json => Player.find(params[:id]),
               :serializer => PlayerSerializer
      end

      def stats
        render :json => Player.find(params[:player_id]).stats,
               :serializer => PlayerStatsSerializer
      end
    end
  end
end
