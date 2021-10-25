package dev.abelab.jphacks.helper.sample;

import java.util.Date;

import dev.abelab.jphacks.db.entity.Room;

/**
 * Room Sample Builder
 */
public class RoomSample extends AbstractSample {

	public static RoomSampleBuilder builder() {
		return new RoomSampleBuilder();
	}

	public static class RoomSampleBuilder {

		private Integer id = SAMPLE_INT;
		private String title = SAMPLE_STR;
		private String description = SAMPLE_STR;
		private Integer ownerId = SAMPLE_INT;
		private Integer presentationTimeLimit = SAMPLE_INT;
		private Integer questionTimeLimit = SAMPLE_INT;
		private Date startAt = SAMPLE_DATE;
		private Date finishAt = SAMPLE_DATE;

		public RoomSampleBuilder id(Integer id) {
			this.id = id;
			return this;
		}

		public RoomSampleBuilder title(String title) {
			this.title = title;
			return this;
		}

		public RoomSampleBuilder description(String description) {
			this.description = description;
			return this;
		}

		public RoomSampleBuilder ownerId(Integer ownerId) {
			this.ownerId = ownerId;
			return this;
		}

		public RoomSampleBuilder presentationTimeLimit(Integer presentationTimeLimit) {
			this.presentationTimeLimit = presentationTimeLimit;
			return this;
		}

		public RoomSampleBuilder questionTimeLimit(Integer questionTimeLimit) {
			this.questionTimeLimit = questionTimeLimit;
			return this;
		}

		public RoomSampleBuilder startAt(Date startAt) {
			this.startAt = startAt;
			return this;
		}

		public RoomSampleBuilder finishAt(Date finishAt) {
			this.finishAt = finishAt;
			return this;
		}

		public Room build() {
			return Room.builder() //
				.id(this.id) //
				.title(this.title) //
				.description(this.description) //
				.ownerId(this.ownerId) //
				.presentationTimeLimit(this.presentationTimeLimit) //
				.questionTimeLimit(this.questionTimeLimit) //
				.startAt(this.startAt) //
				.finishAt(this.finishAt) //
				.build();
		}

	}

}
