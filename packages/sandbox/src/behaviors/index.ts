import FooTar from '@@src/entities/FooTar';

export default function behavior() {
  const a = FooTar.knex;
  console.log(222, a);
}
