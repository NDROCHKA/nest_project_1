import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, min: 1 })
  age: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const userSchema = SchemaFactory.createForClass(User);

userSchema.virtual('id').get(function (){
    return this._id.toHexString();
})

userSchema.set('toJSON' , {
    virtuals:true ,
});